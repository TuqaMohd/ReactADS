import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useSettings, type Difficulty } from "../../contexts/SettingsContext";
import RequireRole from "./RequireRole";
import type { Gender } from "./types";

const rowClasses = "flex items-center justify-between gap-3 py-2 border-b border-gold/20 last:border-0";

export default function AccountPage() {
  const { user, logout, storageMode, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [age, setAge] = useState(user?.age !== undefined ? String(user.age) : "");
  const [gender, setGender] = useState<Gender | "">(user?.gender ?? "");
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingStatus("saving");
    try {
      await updateProfile({
        email,
        name,
        bio,
        age: age === "" ? undefined : Number(age),
        gender: gender === "" ? undefined : gender
      });
      setSavingStatus("saved");
      window.alert("Profile updated successfully.");
      navigate("/dashboard");
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

      <form onSubmit={handleSaveProfile} className="py-3 border-b border-gold/20 space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm text-ink mb-1">
            Display name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="How you'd like to be shown"
            className="w-full rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-ink mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
          />
        </div>

        <div className="flex gap-3">
          <div className="w-24">
            <label htmlFor="age" className="block text-sm text-ink mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="—"
              className="w-full rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="gender" className="block text-sm text-ink mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender | "")}
              className="w-full rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
            >
              <option value="">Not specified</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm text-ink mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short line about yourself"
            rows={3}
            maxLength={280}
            className="w-full rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright resize-none"
          />
          <p className="text-xs text-ink/60 mt-1 text-right">{bio.length}/280</p>
        </div>

        <button
          type="submit"
          disabled={savingStatus === "saving"}
          className="bg-gold text-ink font-semibold px-3 py-1.5 rounded text-sm hover:bg-goldBright transition-colors disabled:opacity-60"
        >
          Save
        </button>

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
