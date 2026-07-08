export type Difficulty = "easy" | "normal" | "hard";

export interface AppSettings {
  difficulty: Difficulty;
}

export const defaultSettings: AppSettings = {
  difficulty: "normal",
};

export type SettingsAction =
  | { type: "UPDATE_SETTINGS"; patch: Partial<AppSettings> }
  | { type: "SETTINGS_LOADED"; settings: AppSettings };

export function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
  switch (action.type) {
    case "UPDATE_SETTINGS":
      return { ...state, ...action.patch };
    case "SETTINGS_LOADED":
      return action.settings;
    default:
      return state;
  }
}
