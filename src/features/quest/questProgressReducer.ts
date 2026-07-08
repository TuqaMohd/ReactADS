export interface QuestProgressState {
  cleared: number[];
}

export type QuestProgressAction =
  | { type: "LEVEL_CLEARED"; levelId: number }
  | { type: "PROGRESS_RESET" };

export const initialQuestProgressState: QuestProgressState = {
  cleared: [],
};

export function questProgressReducer(
  state: QuestProgressState,
  action: QuestProgressAction
): QuestProgressState {
  switch (action.type) {
    case "LEVEL_CLEARED":
      if (state.cleared.includes(action.levelId)) return state;
      return { cleared: [...state.cleared, action.levelId] };

    case "PROGRESS_RESET":
      return initialQuestProgressState;

    default:
      return state;
  }
}
