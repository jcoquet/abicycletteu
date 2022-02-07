import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from "overmind-react";

export const config = {
  state: { folderId: null },
  actions: {
    setFolderId: ({ state }, folderId) => (state.folderId = folderId),
  },
};

export const useAppState = createStateHook();
export const useActions = createActionsHook();
export const useEffects = createEffectsHook();
export const useReaction = createReactionHook();
