import { create } from "zustand";
import { Exercise } from "../types";

interface ExerciseStoreState {
  exercise: Exercise | null;
  setExercise: (exercise: Exercise | null) => void;
}

export const useExerciseStore = create<ExerciseStoreState>((set) => ({
  exercise: null,
  setExercise: (exercise) => set({ exercise }),
}));
