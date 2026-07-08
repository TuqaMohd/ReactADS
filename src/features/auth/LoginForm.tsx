import { useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!username.trim() || !password) {
      setFormError("Enter your username and password.");
      return;
    }

    try {
      await login({ username: username.trim(), password }, rememberMe);
      onSuccess?.();
    } catch {
      setFormError("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xs">
      <div>
        <label htmlFor="username" className="block text-xs font-semibold text-ink mb-1">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ex: Tuqa"
          className="w-full rounded border border-gold bg-slate-200 text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-ink mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-gold text-ink px-3 bg-slate-200 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
        />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me on this device
      </label>
      {(formError || error) && <p className="text-danger text-xs">{formError || error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-gold text-ink font-semibold px-4 py-2 rounded text-sm hover:bg-goldBright transition-colors disabled:opacity-60"
      >
        {isLoading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
