import { httpClient } from "../../shared/api/httpClient";
import type { AuthUser, LoginCredentials } from "./types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

const AUTH_BASE_URL = "/api/auth";

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>(`${AUTH_BASE_URL}/login`, credentials);
  return response.data;
}

export async function refreshRequest(refreshToken: string): Promise<AuthTokens> {
  const response = await httpClient.post<AuthTokens>(`${AUTH_BASE_URL}/refresh`, { refreshToken });
  return response.data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await httpClient.post(`${AUTH_BASE_URL}/logout`, { refreshToken });
}

export async function updateProfileRequest(
  patch: Partial<Pick<AuthUser, "username" | "email" | "name" | "bio" | "age" | "gender">>
): Promise<AuthUser> {
  const response = await httpClient.patch<AuthUser>(`${AUTH_BASE_URL}/me`, patch);
  return response.data;
}
