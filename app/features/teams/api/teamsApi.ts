import apiClient from "../../../config/apiClient";
import { useAuthStore } from "../../login/store/authStore";
import { Team } from "../types";
import { TeamDeleteError, TeamSaveError, TeamsFetchError } from "../errors";

export type CreateTeamPayload = {
  name: string;
  coachId: string;
  category: string;
  assistantCoachIds?: string[];
  staffIds?: string[];
  competition?: string | null;
};

export type UpdateTeamPayload = Partial<CreateTeamPayload>;

const getAuthHeaders = () => {
  const token = useAuthStore.getState().auth?.token;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await apiClient.get("/teams", {
      headers: getAuthHeaders(),
    });
    return response?.data ?? [];
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new TeamsFetchError(error.message);
    }

    throw new TeamsFetchError();
  }
};

export const createTeam = async (payload: CreateTeamPayload): Promise<Team> => {
  try {
    const response = await apiClient.post("/teams", payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new TeamSaveError(error.message);
    }

    throw new TeamSaveError();
  }
};

export const updateTeam = async (
  id: string,
  payload: UpdateTeamPayload,
): Promise<Team> => {
  try {
    const response = await apiClient.patch(`/teams/${id}`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new TeamSaveError(error.message);
    }

    throw new TeamSaveError();
  }
};

export const deleteTeam = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/teams/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new TeamDeleteError(error.message);
    }

    throw new TeamDeleteError();
  }
};
