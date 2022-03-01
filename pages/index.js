import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import useSWR from "swr";
import _ from "lodash";

import Layout from "../components/layout";
import styles from "../styles/carte.module.css";
import { FullscreenImage } from "../components/FullscreenImage";
import { FolderChooser } from "../components/FolderChooser";
import { useActions, useAppState } from "../overmind/hooks";
import { Tools } from "../components/Tools.component";

const fetcher = (session, folderId) => async () => {
  const sid = _.get(session, "data.sid");
  const synotoken = _.get(session, "data.synotoken");
  const domain = _.get(session, "data.domain");
  const res = await fetch(
    `https://${domain}:5001/webapi/entry.cgi?folder_id=${folderId}&additional=["thumbnail","resolution","orientation","video_convert","video_meta","gps"]&sort_by="takentime"&sort_direction="asc"&offset=0&limit=400&api="SYNO.FotoTeam.Browse.Item"&method="list"&version=1&_sid=${sid}&SynoToken=${synotoken}`,
    {}
  );
  const decodedResponse = await res.json();

  if (!decodedResponse.success) {
    throw new Error("An error occurred while fetching the data.");
  }

  const onlyWithGpsItems = decodedResponse.data.list.filter(
    item => item.additional.gps
  );
  return Promise.resolve(onlyWithGpsItems);
};

export default function Home() {
  const session = useSession({ required: true });
  const [src, setSrc] = useState();
  const [group, setGroup] = useState();
  const [freshItems, setFreshItems] = useState([]);
  const {
    folderId,
    leaflet: { map: getMap },
  } = useAppState();
  const actions = useActions();
  useSWR(
    _.has(session, "data.sid") && folderId ? "/api/article" : null,
    fetcher(session, folderId),
    {
      onSuccess: data => setFreshItems(data),
      onError: () => signOut(),
      refreshInterval: 5000,
    }
  );
  const map = getMap && getMap();

  useEffect(() => {
    const sid = _.get(session, "data.sid");
    const synotoken = _.get(session, "data.synotoken");
    const domain = _.get(session, "data.domain");
    if (map) {
      const currentMarkers = group.getLayers();
      const markersToRemove = _.differenceBy(currentMarkers, freshItems, "id");
      const markersToAdd = _.differenceBy(freshItems, currentMarkers, "id");
      const shouldFitBounds =
        markersToAdd.length > 0 || markersToRemove.length > 0;

      markersToAdd.forEach(element => {
        const pictureSrc = `https://${domain}:5001/webapi/entry.cgi?id=${element.additional.thumbnail.unit_id}&cache_key=${element.additional.thumbnail.cache_key}&type=%22unit%22&size=%22xl%22&api=%22SYNO.FotoTeam.Thumbnail%22&method=%22get%22&version=1&SynoToken=${synotoken}&_sid=${sid}`;
        const marker = L.marker(Object.values(element.additional.gps), {
          riseOnHover: true,
        });
        marker.addTo(group);
        marker.id = element.id;
        marker.bindPopup(`${element.filename}`);
        marker.on("click", () => {
          setSrc(pictureSrc);
        });
      });

      markersToRemove.forEach(marker => group.removeLayer(marker));

      if (shouldFitBounds) {
        const allGps = freshItems.map(item =>
          Object.values(item.additional.gps)
        );
        const bounds = L.latLngBounds(allGps).pad(0.1);
        map.flyToBounds(bounds);
      }
    }
  }, [map, freshItems, group, session]);

  return (
    <Layout>
      <Head>
        <title>Carte</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        strategy="lazyOnload"
        onLoad={() => {
          const map = L.map("map", {
            zoomSnap: 0.1,
            attributionControl: false,
            zoomControl: false,
          });
          const group = L.layerGroup().addTo(map);
          map.fitWorld().zoomIn();

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {}
          ).addTo(map);

          setGroup(group);
          actions.setMap(map);
        }}
      />
      <div id="map" className={styles.carte}></div>
      <FullscreenImage src={src} />
      <FolderChooser />
      <Tools />
    </Layout>
  );
}
