export type StorageMode = "local" | "session";

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  roles: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}
