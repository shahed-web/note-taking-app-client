import type { UserRole } from "./auth";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
  pagination: AdminUsersPagination;
}

export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  interests: string[];
}

export interface UpdateAdminUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  interests?: string[];
}