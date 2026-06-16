import apiClient from "../../../config/apiClient";
import { useAuthStore } from "../../login/store/authStore";
import {
  ExercisesDeleteError,
  ExercisesFetchError,
  ExercisesSaveError,
} from "../errors/ExerciseErrors";
import { Exercise } from "../types";

export type CreateExercisePayload = {
  userId: string;
  name: string;
  description?: string;
  alternatives?: string;
  category?: Exercise["category"];
  type?: Exercise["type"];
  gamePhase?: Exercise["gamePhase"];
  activities: string[];
  likes?: number;
  coachBoard?: Exercise["coachBoard"];
};

export type UpdateExercisePayload = Partial<CreateExercisePayload>;

const EXERCISES_ENDPOINT = "/exercises";
const EXERCISE_BY_ID_ENDPOINT = "/exercises/:exerciseId";

const resolveExerciseEndpoint = (exerciseId: string) =>
  EXERCISE_BY_ID_ENDPOINT.replace(":exerciseId", exerciseId);

const getAuthHeaders = () => {
  const token = useAuthStore.getState().auth?.token;

  if (!token) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await apiClient.get<Exercise[]>(EXERCISES_ENDPOINT, {
      headers: getAuthHeaders(),
    });

    return response.data ?? [];
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ExercisesFetchError(error.message);
    }

    throw new ExercisesFetchError();
  }
};

export const createExercise = async (
  payload: CreateExercisePayload,
): Promise<Exercise> => {
  try {
    const response = await apiClient.post<Exercise>(
      EXERCISES_ENDPOINT,
      payload,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ExercisesSaveError(error.message);
    }

    throw new ExercisesSaveError();
  }
};

export const updateExercise = async (
  id: string,
  payload: UpdateExercisePayload,
): Promise<Exercise> => {
  try {
    const response = await apiClient.patch<Exercise>(
      resolveExerciseEndpoint(id),
      payload,
      {
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ExercisesSaveError(error.message);
    }

    throw new ExercisesSaveError();
  }
};

export const deleteExercise = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(resolveExerciseEndpoint(id), {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new ExercisesDeleteError(error.message);
    }

    throw new ExercisesDeleteError();
  }
};
