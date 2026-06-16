import apiClient from "../../../config/apiClient";
import { useAuthStore } from "../../login/store/authStore";
import { GamesDeleteError, GamesFetchError, GamesSaveError } from "../errors";
import { Game, GameRoster } from "../types";

export type CreateGamePayload = Omit<Game, "id">;
export type UpdateGamePayload = Partial<CreateGamePayload>;

export type CreateGameRosterPayload = Omit<GameRoster, "id" | "gameId">;
export type UpdateGameRosterPayload = Partial<CreateGameRosterPayload>;

const getAuthHeaders = () => {
  const token = useAuthStore.getState().auth?.token;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getGames = async (): Promise<Game[]> => {
  try {
    const response = await apiClient.get("/games", {
      headers: getAuthHeaders(),
    });
    return response?.data ?? [];
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesFetchError(error.message);
    }
    throw new GamesFetchError();
  }
};

export const createGame = async (payload: CreateGamePayload): Promise<Game> => {
  try {
    const response = await apiClient.post("/games", payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesSaveError(error.message);
    }
    throw new GamesSaveError();
  }
};

export const updateGame = async (
  id: string,
  payload: UpdateGamePayload,
): Promise<Game> => {
  try {
    const response = await apiClient.patch(`/games/${id}`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesSaveError(error.message);
    }
    throw new GamesSaveError();
  }
};

export const deleteGame = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/games/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesDeleteError(error.message);
    }
    throw new GamesDeleteError();
  }
};

export const getGameRoster = async (gameId: string): Promise<GameRoster> => {
  try {
    const response = await apiClient.get(`/games/${gameId}/roster`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesFetchError(error.message);
    }
    throw new GamesFetchError();
  }
};

export const createGameRoster = async (
  gameId: string,
  payload: CreateGameRosterPayload,
): Promise<GameRoster> => {
  try {
    const response = await apiClient.post(`/games/${gameId}/roster`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.log(error)
    if (error instanceof Error && error.message) {
      throw new GamesSaveError(error.message);
    }
    throw new GamesSaveError();
  }
};

export const updateGameRoster = async (
  rosterId: string,
  payload: UpdateGameRosterPayload,
): Promise<GameRoster> => {
  try {
    const response = await apiClient.patch(`/games/roster/${rosterId}`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesSaveError(error.message);
    }
    throw new GamesSaveError();
  }
};

export const deleteGameRoster = async (rosterId: string): Promise<void> => {
  try {
    await apiClient.delete(`/games/roster/${rosterId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new GamesDeleteError(error.message);
    }
    throw new GamesDeleteError();
  }
};
