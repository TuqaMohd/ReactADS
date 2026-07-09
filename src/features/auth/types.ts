export type StorageMode = "local" | "session";

export type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  roles: string[];
  name?: string;
  bio?: string;
  age?: number;
  gender?: Gender;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
