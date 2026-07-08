export interface TrialOption {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
}

export interface TrialLevel {
  id: number;
  title: string;
  description: string;
  brokenCode: string;
  question: string;
  options: TrialOption[];
}

export type LevelStatus = "locked" | "available" | "cleared";


export interface QuestContextValue {
  cleared: number[];
  markCleared: (id: number) => void;
  resetProgress: () => void;
}
