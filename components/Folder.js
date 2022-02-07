import _ from "lodash";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { List, Button, Icon } from "semantic-ui-react";
import useSWR from "swr";

import styles from "./Folder.module.css";
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
    <List.List>
      {data.data.list.map(folder => (
        <Folder key={folder.name} {...folder} />
      ))}
    </List.List>
  );
};

export const Folder = ({ root = false, name, id }) => {
  const [state, dispatch] = useContext(FolderChooserContext);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const handleClick = e => {
    e.stopPropagation();
    setIsFolderOpen(!isFolderOpen);
  };

  const handleFolderSelection = e => {
    e.stopPropagation();
    if (id === state.folderId) return;
    dispatch({ type: "select_folder", id });
  };

  const isButtonActive = state.folderId === id;

  return (
    <List.Item onClick={handleClick} className={styles.folder}>
      <List.Icon name={isFolderOpen ? "folder open" : "folder"} />
      <List.Content>
        {root ? "/" : name.split("/").pop()}
        <Button
          onClick={handleFolderSelection}
          size="mini"
          floated="right"
          icon
          toggle
          active={isButtonActive}
        >
          <Icon name="eye" />
        </Button>
        {isFolderOpen && <FolderList id={id} />}
      </List.Content>
    </List.Item>
  );
};
