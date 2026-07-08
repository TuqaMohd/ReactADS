import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export class ApiError extends Error {
  status?: number;
  retryAfterMs?: number;

  constructor(message: string, status?: number, retryAfterMs?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

export const httpClient = axios.create({
  timeout: 10000
});

function isSameOrigin(url: string): boolean {
  try {
    return new URL(url, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

interface AuthHandlers {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onAuthFailure: () => void;
}

let authHandlers: AuthHandlers | null = null;

export function registerAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = handlers;
}

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authHandlers?.getAccessToken() ?? null;

  if (token && isSameOrigin(config.url ?? "")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new ApiError("Network error - please check your connection."));
    }

    const { status, headers, config } = error.response;
    const originalRequest = config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (status === 401 && authHandlers && !originalRequest._retried && isSameOrigin(originalRequest.url ?? "")) {
      originalRequest._retried = true;
      const newToken = await authHandlers.refreshAccessToken();

      if (newToken) {
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        return httpClient(originalRequest);
      }

      authHandlers.onAuthFailure();
      return Promise.reject(new ApiError("Session expired - please log in again.", status));
    }

    if (status === 429) {
      const retryAfterHeader = headers["retry-after"];
      const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
      return Promise.reject(
        new ApiError("Error 429 (Too many requests) - please try again later.", status, retryAfterMs)
      );
    }

    return Promise.reject(new ApiError(`Request failed with status ${status}`, status));
  }
);
