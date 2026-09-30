import api from "./axios";
import type {
  AdminUsersResponse,
  AdminUserResponse,
  AdminActionResponse,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "../types/admin";
import type { AdminNotesResponse } from "../types/adminNote";
import type { GroupedInterestsResponse } from "../types/interest";

export const getUsers = async (
  page = 1,
  limit = 10
): Promise<AdminUsersResponse> => {
  const response = await api.get<AdminUsersResponse>("/admin/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const createUser = async (
  data: CreateAdminUserInput
): Promise<AdminUserResponse> => {
  const response = await api.post<AdminUserResponse>(
    "/admin/users",
    data
  );

  return response.data;
};

export const updateUser = async (
  userId: string,
  data: UpdateAdminUserInput
): Promise<AdminUserResponse> => {
  const response = await api.patch<AdminUserResponse>(
    `/admin/users/${userId}`,
    data
  );

  return response.data;
};

export const deleteUser = async (
  userId: string
): Promise<AdminActionResponse> => {
  const response = await api.delete<AdminActionResponse>(
    `/admin/users/${userId}`
  );

  return response.data;
};

export const getAllNotes = async (
  page = 1,
  limit = 10
): Promise<AdminNotesResponse> => {
  const response = await api.get<AdminNotesResponse>("/admin/notes", {
    params: { page, limit },
  });

  return response.data;
};

export const getUsersGroupedByInterest =
  async (): Promise<GroupedInterestsResponse> => {
    const response = await api.get<GroupedInterestsResponse>(
      "/admin/users/interests/grouped"
    );

    return response.data;
  };