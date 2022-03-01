import { createContext, useReducer } from "react";
import { List, Modal, Button } from "semantic-ui-react";

import { useActions, useAppState } from "../overmind/hooks";

import { Folder } from "./Folder";

export const FolderChooserContext = createContext();

const initialState = {
  folderId: null,
};

const reducerImpl = (state, action) => {
  switch (action.type) {
    case "select_folder":
      return { folderId: action.id };
    default:
      throw new Error();
  }
};

export const FolderChooser = () => {
  const { folderChooserOpened: opened } = useAppState();
  const [state, dispatch] = useReducer(reducerImpl, initialState);
  const actions = useActions();

  const submit = () => {
    if (state.folderId) actions.setFolderId(state.folderId);
    actions.closeFolderChooser();
  };

  const isSubmitButtonEnabled = state.folderId !== null;
  return (
    <Modal role="dialog" size="tiny" open={opened}>
      <Modal.Header>Choose a folder</Modal.Header>
      <Modal.Content scrolling>
        <FolderChooserContext.Provider value={[state, dispatch]}>
          <List verticalAlign="top">
            <Folder root name="/" id={1} open />
          </List>
        </FolderChooserContext.Provider>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => actions.closeFolderChooser()}>
          Cancel
        </Button>
        <Button disabled={!isSubmitButtonEnabled} onClick={submit} positive>
          See this folder
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

FolderChooser.displayName = "FolderChooser";
