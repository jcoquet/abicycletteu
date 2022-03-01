import { Button, Icon } from "semantic-ui-react";

import { useActions } from "../overmind/hooks";

import styles from "./Tools.module.css";

export const Tools = () => {
  const actions = useActions();

  const openFolderChooser = () => actions.openFolderChooser();

  const zoomIn = () => actions.zoomIn();

  const zoomOut = () => actions.zoomOut();

  const fitBounds = () => actions.fitBounds();

  return (
    <Button.Group basic vertical className={styles.tools}>
      <Button aria-label="zoom in" icon onClick={zoomIn}>
        <Icon name="plus" />
      </Button>
      <Button aria-label="zoom out" icon onClick={zoomOut}>
        <Icon name="minus" />
      </Button>
      <Button aria-label="choose a folder" icon onClick={openFolderChooser}>
        <Icon name="folder open" />
      </Button>
      <Button aria-label="see all markers" icon onClick={fitBounds}>
        <Icon name="expand" />
      </Button>
    </Button.Group>
  );
};
