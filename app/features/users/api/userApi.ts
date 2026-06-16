import apiClient from "../../../config/apiClient";
import { useAuthStore } from "../../login/store/authStore";
import { User, UserRole } from "../types";
import {
  UserDeleteError,
  UsersFetchError,
  UserPromoteError,
  UserSaveError,
} from "../errors";

export type CreateUserPayload = {
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

const getAuthHeaders = () => {
  const token = useAuthStore.getState().auth?.token;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/users", {
      headers: getAuthHeaders(),
    });
    return response?.data ?? [];
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new UsersFetchError(error.message);
    }

    throw new UsersFetchError();
  }
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  try {
    const response = await apiClient.post("/users", payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new UserSaveError(error.message);
    }

    throw new UserSaveError();
  }
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  try {
    const response = await apiClient.patch(`/users/${id}`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new UserSaveError(error.message);
    }

    throw new UserSaveError();
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new UserDeleteError(error.message);
    }

    throw new UserDeleteError();
  }
};

export const promoteUserToRoot = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.patch(
      `/users/${id}/promote-to-root`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new UserPromoteError(error.message);
    }

    throw new UserPromoteError();
  }
};
