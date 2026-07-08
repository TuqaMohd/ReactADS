import { useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useSettings, type Difficulty } from "../../contexts/SettingsContext";
import RequireRole from "./RequireRole";

const rowClasses = "flex items-center justify-between gap-3 py-2 border-b border-gold/20 last:border-0";

export default function AccountPage() {
  const { user, logout, storageMode, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingStatus("saving");
    try {
      await updateProfile({ email });
      setSavingStatus("saved");
    } catch {
      setSavingStatus("error");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gold mb-4">My Account</h2>

      <div className={rowClasses}>
        <span className="text-ink text-sm">Logged in as</span>
        <span className="font-semibold text-emeraldDark">{user?.username}</span>
      </div>

      <div className={rowClasses}>
        <span className="text-ink text-sm">Role</span>
        <span className="font-semibold text-emeraldDark">{user?.roles.join(", ")}</span>
      </div>

      <div className={rowClasses}>
        <span className="text-ink text-sm">Session storage</span>
        <span className="font-semibold text-emeraldDark">
          {storageMode === "local" ? "Remembered (localStorage)" : "This session only (sessionStorage)"}
        </span>
      </div>

      <div className={rowClasses}>
        <span className="text-ink text-sm">Theme</span>
        <button
          onClick={toggleTheme}
          className="text-sm font-semibold text-emeraldDark hover:text-emerald underline"
        >
          Switch to {theme === "dark" ? "light" : "dark"} mode
        </button>
      </div>

      <div className={rowClasses}>
        <span className="text-ink text-sm">Difficulty</span>
        <select
          value={settings.difficulty}
          onChange={(e) => updateSettings({ difficulty: e.target.value as Difficulty })}
          className="border border-gold rounded px-2 py-1 text-sm bg-parchment text-ink"
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <form onSubmit={handleSaveProfile} className="py-3 border-b border-gold/20">
        <label htmlFor="email" className="block text-sm text-ink mb-1">
          Email
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
          />
          <button
            type="submit"
            disabled={savingStatus === "saving"}
            className="bg-gold text-ink font-semibold px-3 py-1.5 rounded text-sm hover:bg-goldBright transition-colors disabled:opacity-60"
          >
            Save
          </button>
        </div>
        {savingStatus === "saved" && <p className="text-emeraldDark text-xs mt-1">Profile updated.</p>}
        {savingStatus === "error" && (
          <p className="text-danger text-xs mt-1">Couldn't reach the server to save changes.</p>
        )}
      </form>

      <RequireRole role="admin">
        <div className="py-3 border-b border-gold/20">
          <p className="text-xs uppercase tracking-wide text-emeraldDark/70 font-bold mb-1">Admin Tools</p>
          <p className="text-ink/70 text-sm">Only visible to accounts with the admin role.</p>
        </div>
      </RequireRole>

      <button
        onClick={logout}
        className="mt-5 bg-danger text-parchment font-semibold px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity"
      >
        Log out
      </button>
    </div>
  );
}
