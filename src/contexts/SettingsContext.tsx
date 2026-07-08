import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { defaultSettings, settingsReducer, type AppSettings, type Difficulty } from "./settingsReducer";

export type { Difficulty, AppSettings };

export interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const STORAGE_KEY = "cgs_settings";

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadInitialSettings(): AppSettings {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, undefined, loadInitialSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", patch });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateSettings }),
    [settings, updateSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used inside a <SettingsProvider>");
  }
  return ctx;
}
