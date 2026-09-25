import apiClient from "./client";

export type AdminInfo = {
  id: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  admin: AdminInfo;
};

export type RefreshResponse = {
  accessToken: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

export async function refresh(): Promise<RefreshResponse> {
  const { data } = await apiClient.post<RefreshResponse>("/auth/refresh");
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getCurrentAdmin(): Promise<AdminInfo> {
  const { data } = await apiClient.get<AdminInfo>("/auth/me");
  return data;
}
