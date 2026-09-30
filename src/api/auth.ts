import type { LoginResponse } from "../types/auth";
import api from "./axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/refresh-token");

  return response.data;
};