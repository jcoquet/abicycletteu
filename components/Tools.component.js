import { Button, Icon } from "semantic-ui-react";

import { useActions } from "../overmind";

import styles from "./Tools.module.css";

export const Tools = () => {
  const actions = useActions();

  const openFolderChooser = () => actions.openFolderChooser();

  const zoomIn = () => actions.zoomIn();

  const zoomOut = () => actions.zoomOut();

  const fitBounds = () => actions.fitBounds();

  return (
    <Button.Group basic vertical className={styles.tools}>
      <Button icon onClick={zoomIn}>
        <Icon name="plus" />
      </Button>
      <Button icon onClick={zoomOut}>
        <Icon name="minus" />
      </Button>
      <Button icon onClick={openFolderChooser}>
        <Icon name="folder open" />
      </Button>
      <Button icon onClick={fitBounds}>
        <Icon name="expand" />
      </Button>
    </Button.Group>
  );
};
