import _ from "lodash";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { List } from "semantic-ui-react";
import useSWR from "swr";

import { FolderChooserContext } from "./FolderChooser";

const fetcher = url => fetch(url).then(r => r.json());

const getBrowseFolderUrl = (domain, sid, synotoken, id) =>
  `https://${domain}:5001/webapi/entry.cgi?id=${id}&offset=0&limit=5000&sort_by="filename"&sort_direction="asc"&additional=["sharing_info","access_permission","thumbnail","password_verified"]&api="SYNO.FotoTeam.Browse.Folder"&method="list"&version=1&SynoToken=${synotoken}&_sid=${sid}`;

export const FolderList = ({ id }) => {
  const session = useSession({ required: true });
  const sid = _.get(session, "data.sid");
  const synotoken = _.get(session, "data.synotoken");
  const domain = _.get(session, "data.domain");
  const { data } = useSWR(
    id ? getBrowseFolderUrl(domain, sid, synotoken, id) : null,
    fetcher
  );
  if (!data || data.data.list.length === 0)
    return <List.Description>No sub folder</List.Description>;

  return (
    <List selection>
      {data.data.list.map(folder => (
        <Folder key={folder.name} {...folder} />
      ))}
    </List>
  );
};

export const Folder = ({ root = false, name, id, open = false }) => {
  const [state, dispatch] = useContext(FolderChooserContext);
  const [isFolderOpen, setIsFolderOpen] = useState(open);
  const isFolderSelected = id === state.folderId;

  const selectFolder = e => {
    e.stopPropagation();
    setIsFolderOpen(!isFolderOpen);
    dispatch({ type: "select_folder", id });
  };

  return (
    <List.Item onClick={selectFolder} active={isFolderSelected}>
      <List.Icon name={isFolderOpen ? "folder open" : "folder"} />
      <List.Content>
        <span>{root ? "/" : name.split("/").pop()}</span>
        {isFolderOpen && <FolderList id={id} />}
      </List.Content>
    </List.Item>
  );
};
