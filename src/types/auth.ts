export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginData {
  accessToken: string;
  user: AuthUser;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}