import { create } from "zustand";
import { db, trainings, trainingPlayers } from "../db";
import { Training, NewTraining, TrainingPlayer } from "../types/database";
import { eq } from "drizzle-orm";

export interface TrainingStoreState {
  trainingsList: Training[];
  trainings: Training[];
  selectedTraining: Training | null;
  attendanceMap: Record<number, TrainingPlayer>; // playerId -> attendance
  isLoading: boolean;
  error: string | null;

  setSelectedTraining: (training: Training | null) => void;
  fetchTrainings: (teamId: number) => Promise<Training[]>;
  createTraining: (trainingData: NewTraining) => Promise<Training | null>;
  deleteTraining: (trainingId: number) => Promise<boolean>;
  fetchTrainingAttendance: (trainingId: number) => Promise<Record<number, TrainingPlayer>>;
  togglePlayerAttendance: (trainingId: number, playerId: number, attended: boolean) => Promise<boolean>;
}

export const useTrainingStore = create<TrainingStoreState>((set, get) => ({
  trainingsList: [],
  trainings: [],
  selectedTraining: null,
  attendanceMap: {},
  isLoading: false,
  error: null,

  setSelectedTraining: (training: Training | null) => set({ selectedTraining: training }),

  fetchTrainings: async (teamId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.select().from(trainings).where(eq(trainings.teamId, teamId));
      set({ trainingsList: result, trainings: result, isLoading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch trainings", isLoading: false });
      return [];
    }
  },

  createTraining: async (trainingData: NewTraining) => {
    set({ isLoading: true, error: null });
    try {
      const [newTraining] = await db.insert(trainings).values(trainingData).returning();
      const updated = [...get().trainingsList, newTraining];
      set({ trainingsList: updated, trainings: updated, isLoading: false });
      return newTraining;
    } catch (err: any) {
      set({ error: err.message || "Failed to create training", isLoading: false });
      return null;
    }
  },

  deleteTraining: async (trainingId: number) => {
    set({ isLoading: true, error: null });
    try {
      await db.delete(trainings).where(eq(trainings.id, trainingId));
      const updated = get().trainingsList.filter((t) => t.id !== trainingId);
      set({
        trainingsList: updated,
        trainings: updated,
        selectedTraining: get().selectedTraining?.id === trainingId ? null : get().selectedTraining,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete training", isLoading: false });
      return false;
    }
  },

  fetchTrainingAttendance: async (trainingId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db
        .select()
        .from(trainingPlayers)
        .where(eq(trainingPlayers.trainingId, trainingId));
      const map: Record<number, TrainingPlayer> = {};
      for (const row of result) {
        map[row.playerId] = row;
      }
      set({ attendanceMap: map, isLoading: false });
      return map;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch attendance", isLoading: false });
      return {};
    }
  },

  togglePlayerAttendance: async (trainingId: number, playerId: number, attended: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const existing = await db
        .select()
        .from(trainingPlayers)
        .where(eq(trainingPlayers.trainingId, trainingId));
      const match = existing.find((tp) => tp.playerId === playerId);

      if (match) {
        await db
          .update(trainingPlayers)
          .set({ attended: attended ? 1 : 0 })
          .where(eq(trainingPlayers.id, match.id));
      } else {
        await db.insert(trainingPlayers).values({
          trainingId,
          playerId,
          attended: attended ? 1 : 0,
        });
      }

      await get().fetchTrainingAttendance(trainingId);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to update attendance", isLoading: false });
      return false;
    }
  },
}));

export default useTrainingStore;
