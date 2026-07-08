import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { registerAuthHandlers } from "../shared/api/httpClient";
import { loginRequest, logoutRequest, refreshRequest, updateProfileRequest } from "../features/auth/api";
import { clearSession, loadSession, saveSession } from "../features/auth/session";
import { createGuestToken, getExpiryTime, isTokenExpired } from "../features/auth/jwt";
import { permissionsForRoles } from "../features/auth/rbac";
import type { AuthUser, LoginCredentials, StorageMode } from "../features/auth/types";

export type { AuthUser };

const REFRESH_MARGIN_MS = 60_000;
const GUEST_SESSION_TTL_MS = 4 * 60 * 60 * 1000;

interface Session {
  accessToken: string;
  refreshToken: string | null;
  user: AuthUser;
  storageMode: StorageMode;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  storageMode: StorageMode | null;
  login: (credentials: LoginCredentials, rememberMe: boolean) => Promise<void>;
  loginAsGuest: (username: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "username" | "email">>) => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  sessionRef.current = session;

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  const endSession = useCallback(() => {
    clearRefreshTimer();
    clearSession();
    setSession(null);
  }, [clearRefreshTimer]);

  const persist = useCallback((next: Session) => {
    saveSession(
      { accessToken: next.accessToken, refreshToken: next.refreshToken, user: next.user },
      next.storageMode === "local"
    );
    setSession(next);
  }, []);

  const performRefresh = useCallback(async (): Promise<string | null> => {
    const current = sessionRef.current;
    if (!current?.refreshToken) {
      return null;
    }

    try {
      const tokens = await refreshRequest(current.refreshToken);
      persist({ ...current, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      return tokens.accessToken;
    } catch {
      return null;
    }
  }, [persist]);

  const scheduleRefresh = useCallback(
    (accessToken: string, refreshToken: string | null) => {
      clearRefreshTimer();

      const expiry = getExpiryTime(accessToken);
      if (expiry === null) {
        return;
      }

      const delay = Math.max(expiry - Date.now() - REFRESH_MARGIN_MS, 0);

      refreshTimer.current = setTimeout(() => {
        if (!refreshToken) {
          endSession();
          return;
        }

        performRefresh().then((token) => {
          if (!token) {
            endSession();
          }
        });
      }, delay);
    },
    [clearRefreshTimer, endSession, performRefresh]
  );

  useEffect(() => {
    registerAuthHandlers({
      getAccessToken: () => sessionRef.current?.accessToken ?? null,
      refreshAccessToken: performRefresh,
      onAuthFailure: endSession
    });
  }, [performRefresh, endSession]);

  useEffect(() => {
    const stored = loadSession();
    if (!stored) {
      return;
    }

    const storageMode: StorageMode = stored.persist ? "local" : "session";
    const storedSession = stored.session;

    if (!isTokenExpired(storedSession.accessToken)) {
      setSession({ ...storedSession, storageMode });
      return;
    }

    if (!storedSession.refreshToken) {
      clearSession();
      return;
    }

    refreshRequest(storedSession.refreshToken)
      .then((tokens) => {
        persist({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: storedSession.user,
          storageMode
        });
      })
      .catch(() => {
        clearSession();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!session) {
      clearRefreshTimer();
      return;
    }

    scheduleRefresh(session.accessToken, session.refreshToken);
    return clearRefreshTimer;
  }, [session, scheduleRefresh, clearRefreshTimer]);

  const login = useCallback( //login functionality implementation
    async (credentials: LoginCredentials, rememberMe: boolean) => { 
      setIsLoading(true);
      setError(null);

      try {
        const response = await loginRequest(credentials);
        persist({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
          storageMode: rememberMe ? "local" : "session"
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed - please try again.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [persist]
  );

  const loginAsGuest = useCallback(
    (username: string) => {
      const accessToken = createGuestToken(username, GUEST_SESSION_TTL_MS);
      persist({
        accessToken,
        refreshToken: null,
        user: { id: username, username, roles: ["guest"] },
        storageMode: "session"
      });
    },
    [persist]
  );

  const logout = useCallback(() => { //logout functionality implementation
    const current = sessionRef.current;
    if (current?.refreshToken) {
      logoutRequest(current.refreshToken).catch(() => {});
    }
    endSession();
  }, [endSession]);

  const updateProfile = useCallback(
    async (patch: Partial<Pick<AuthUser, "username" | "email">>) => {
      const current = sessionRef.current;
      if (!current) {
        return;
      }

      const updatedUser = await updateProfileRequest(patch);
      persist({ ...current, user: updatedUser });
    },
    [persist]
  );

  const hasRole = useCallback((role: string) => session?.user.roles.includes(role) ?? false, [session]);

  const hasPermission = useCallback(
    (permission: string) => permissionsForRoles(session?.user.roles ?? []).includes(permission),
    [session]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      isLoading,
      error,
      storageMode: session?.storageMode ?? null,
      login,
      loginAsGuest,
      logout,
      updateProfile,
      hasRole,
      hasPermission
    }),
    [session, isLoading, error, login, loginAsGuest, logout, updateProfile, hasRole, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
