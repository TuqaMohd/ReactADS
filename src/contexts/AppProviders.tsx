import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { SettingsProvider } from "./SettingsContext";
import { QuestProgressProvider } from "../features/quest/QuestProgressContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <QuestProgressProvider>{children}</QuestProgressProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
