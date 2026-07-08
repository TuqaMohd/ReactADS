import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { QuestContextValue } from "./types";
import { initialQuestProgressState, questProgressReducer } from "./questProgressReducer";

const QuestProgressContext = createContext<QuestContextValue | null>(null);

export function QuestProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(questProgressReducer, initialQuestProgressState);

  const markCleared = useCallback((id: number) => {
    dispatch({ type: "LEVEL_CLEARED", levelId: id });
  }, []);

  const resetProgress = useCallback(() => {
    dispatch({ type: "PROGRESS_RESET" });
  }, []);

  const value = useMemo<QuestContextValue>(
    () => ({ cleared: state.cleared, markCleared, resetProgress }),
    [state.cleared, markCleared, resetProgress]
  );

  return <QuestProgressContext.Provider value={value}>{children}</QuestProgressContext.Provider>;
}

export function useQuestProgress(): QuestContextValue {
  const ctx = useContext(QuestProgressContext);
  if (!ctx) {
    throw new Error("useQuestProgress must be used inside a <QuestProgressProvider>");
  }
  return ctx;
}
