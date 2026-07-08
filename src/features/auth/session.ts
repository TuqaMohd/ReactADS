import type { AuthUser } from "./types";

export interface StoredSession {
  accessToken: string;
  refreshToken: string | null;
  user: AuthUser;
}

const SESSION_KEY = "cgs_auth_session";

export function saveSession(session: StoredSession, persist: boolean): void {
  const target = persist ? localStorage : sessionStorage;
  const other = persist ? sessionStorage : localStorage;
  other.removeItem(SESSION_KEY);
  target.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): { session: StoredSession; persist: boolean } | null {
  const local = localStorage.getItem(SESSION_KEY);
  if (local) {
    return { session: JSON.parse(local) as StoredSession, persist: true };
  }

  const scoped = sessionStorage.getItem(SESSION_KEY);
  if (scoped) {
    return { session: JSON.parse(scoped) as StoredSession, persist: false };
  }

  return null;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
