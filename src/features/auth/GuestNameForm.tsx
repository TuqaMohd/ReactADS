import { useState, type FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function GuestNameForm() {
  const { loginAsGuest } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Enter a name or nickname to continue.");
      return;
    }
    loginAsGuest(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xs">
      <div>
        <input
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          placeholder="ex: Tuqa"
          className="w-full rounded border border-gold bg-parchment text-ink px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-goldBright"
        />
        {error && <p className="text-danger text-xs mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        className="bg-gold text-ink font-semibold px-4 py-2 rounded text-sm hover:bg-goldBright transition-colors"
      >
        Continue
      </button>
    </form>
  );
}
