import { useState, memo, createContext, useReducer, useEffect } from "react";
import { Button, Icon, List, Modal } from "semantic-ui-react";

import { useActions } from "../overmind";

import { Folder } from "./Folder";
import styles from "./FolderChooser.module.css";

export const FolderChooserContext = createContext();

const initialState = {
  folderId: null,
};

const reducerImpl = (state, action) => {
  console.log({ state, action });
  switch (action.type) {
    case "select_folder":
      return { folderId: action.id };
    default:
      throw new Error();
  }
};

export const FolderChooser = memo(() => {
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducerImpl, initialState);
  const actions = useActions();

  useEffect(() => {
    actions.setFolderId(state.folderId);
  }, [state.folderId, actions]);

  const isSubmitButtonEnabled = state.folderId !== null;

  return (
    <Modal
      size="tiny"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button className={styles.trigger}>Choose a folder</Button>}
    >
      <Modal.Header>Profile Picture</Modal.Header>
      <Modal.Content scrolling>
        <FolderChooserContext.Provider value={[state, dispatch]}>
          <List verticalAlign="top">
            <Folder root name="/" id={1} />
          </List>
        </FolderChooserContext.Provider>
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={!isSubmitButtonEnabled}
          onClick={() => setOpen(false)}
          primary
        >
          Proceed <Icon name="chevron right" />
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

FolderChooser.displayName = "FolderChooser";
