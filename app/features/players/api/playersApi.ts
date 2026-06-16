import { Player, PlayerStats } from "../types";
import apiClient from "../../../config/apiClient";
import { useAuthStore } from "../../login";
import { PlayerDeleteError } from "../errors";

export type CreatePlayerPayload = {
  teamId: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  nationality?: string;
  phoneNumber?: string;
  email?: string;
  isActive: boolean; // Indicate if the player can be selected for matches
  jerseyNumber: number;
  jerseyName: string;
};

export type UpdatePlayerPayload = Partial<CreatePlayerPayload>;

const getAuthHeaders = () => {
  const token = useAuthStore.getState().auth?.token;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function getPlayers(teamId?: string): Promise<Player[]> {
  const response = await apiClient.get<Player[]>("/players", {
    params: teamId ? { teamId } : {},
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function getPlayerStats(playerId: string): Promise<PlayerStats[]> {
  const response = await apiClient.get<PlayerStats[]>(
    `/players/${playerId}/stats`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
}

export async function createPlayer(
  payload: CreatePlayerPayload,
): Promise<Player> {
  console.log("Creating player with payload:", payload);
  const response = await apiClient.post<Player>("/players", payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function updatePlayer(
  id: string,
  payload: UpdatePlayerPayload,
): Promise<Player> {
  const response = await apiClient.patch<Player>(`/players/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export const deletePlayer = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/players/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new PlayerDeleteError(error.message);
    }

    throw new PlayerDeleteError();
  }
};
