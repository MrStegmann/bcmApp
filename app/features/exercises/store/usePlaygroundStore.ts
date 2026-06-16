import { create } from "zustand";
import { Object as BoardObject, Line, CoachBoard, Exercise, ToolbarTool } from "../types";

interface PlaygroundState {
  isToolbarExpanded: boolean;
  toggleToolbar: () => void;
  selectedTool: ToolbarTool | null;
  setSelectedTool: (tool: ToolbarTool | null) => void;
  selectedObject: BoardObject | null;
  setSelectedObject: (obj: BoardObject | null) => void;
  selectedLineId: string | null;
  setSelectedLineId: (id: string | null) => void;
  objects: BoardObject[];
  lines: Line[];
  addObject: (obj: BoardObject) => void;
  updateObjectPosition: (id: string, x: number, y: number) => void;
  updateObjectRotation: (id: string, rotation: number) => void;
  clearObjects: () => void;
  removeObject: (id: string) => void;
  addLine: (line: Line) => void;
  removeLine: (id: string) => void;
  updateLinePoints: (id: string, points: { index: number; x: number; y: number }[]) => void;
  scale: number;
  setScale: (scale: number) => void;
  boards: CoachBoard[];
  currentBoardIndex: number;
  goToBoard: (index: number) => void;
  createNextBoard: (newObjects: BoardObject[]) => void;
  lastSelectTime: number;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  deleteCurrentBoard: () => void;
  isOptionsOpen: boolean;
  setOptionsOpen: (open: boolean) => void;
  exerciseDetails: Partial<Exercise>;
  updateExerciseDetails: (details: Partial<Exercise>) => void;
  setInitialExercise: (exercise?: Exercise) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  isOptionsOpen: false,
  setOptionsOpen: (isOptionsOpen) => set({ isOptionsOpen }),
  exerciseDetails: {
    name: "",
    description: "",
    alternatives: "",
    category: [],
    type: [],
    gamePhase: [],
    activities: [],
  },
  updateExerciseDetails: (details) => set((state) => ({
    exerciseDetails: { ...state.exerciseDetails, ...details }
  })),
  setInitialExercise: (exercise) => {
    if (exercise) {
      const firstBoard = exercise.coachBoard && exercise.coachBoard.length > 0 ? exercise.coachBoard[0] : null;
      set({
        exerciseDetails: {
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          alternatives: exercise.alternatives,
          category: exercise.category,
          type: exercise.type,
          gamePhase: exercise.gamePhase,
          activities: exercise.activities,
        },
        boards: exercise.coachBoard || [],
        objects: firstBoard?.objects || [],
        lines: firstBoard?.lines || [],
        currentBoardIndex: 0,
        isEditing: true,
        selectedObject: null,
        selectedLineId: null,
        selectedTool: null,
      });
    } else {
      set({
        exerciseDetails: {
          name: "",
          description: "",
          alternatives: "",
          category: [],
          type: [],
          gamePhase: [],
          activities: [],
        },
        boards: [],
        objects: [],
        lines: [],
        currentBoardIndex: 0,
        isEditing: false,
        selectedObject: null,
        selectedLineId: null,
        selectedTool: null,
      });
    }
  },
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  scale: 1,
  setScale: (scale) => set({ scale }),
  isToolbarExpanded: false,
  toggleToolbar: () =>
    set((state) => ({ isToolbarExpanded: !state.isToolbarExpanded })),
  selectedTool: null,
  setSelectedTool: (tool) => set({ selectedTool: tool, selectedObject: null, selectedLineId: null }),
  selectedObject: null,
  lastSelectTime: 0,
  setSelectedObject: (obj) => set((state) => ({
    selectedObject: obj,
    selectedLineId: null,
    selectedTool: obj ? null : state.selectedTool,
    lastSelectTime: obj ? Date.now() : state.lastSelectTime
  })),
  selectedLineId: null,
  setSelectedLineId: (id) => set((state) => ({
    selectedLineId: id,
    selectedObject: null,
    selectedTool: id ? null : state.selectedTool,
    lastSelectTime: id ? Date.now() : state.lastSelectTime
  })),
  objects: [],
  lines: [],
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  updateObjectPosition: (id, x, y) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, x, y } : o)),
    })),
  updateObjectRotation: (id, rotation) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, rotation } : o)),
    })),
  clearObjects: () => set({ objects: [], lines: [], selectedObject: null, selectedLineId: null }),
  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
      selectedObject: state.selectedObject?.id === id ? null : state.selectedObject,
    })),
  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),
  removeLine: (id) => set((state) => ({
    lines: state.lines.filter((l) => l.id !== id),
    selectedLineId: state.selectedLineId === id ? null : state.selectedLineId
  })),
  updateLinePoints: (id, points) => set((state) => ({
    lines: state.lines.map(l => l.id === id ? {
      ...l,
      points,
      startX: points.length > 0 ? points[0].x : l.startX,
      startY: points.length > 0 ? points[0].y : l.startY,
      endX: points.length > 0 ? points[points.length - 1].x : l.endX,
      endY: points.length > 0 ? points[points.length - 1].y : l.endY,
    } : l)
  })),
  boards: [],
  currentBoardIndex: 0,
  goToBoard: (index) => set((state) => {
    const updatedBoards = [...state.boards];
    if (updatedBoards.length === 0) {
      updatedBoards.push({ id: "0", index: 0, objects: state.objects, lines: state.lines });
    } else {
      updatedBoards[state.currentBoardIndex] = {
        ...updatedBoards[state.currentBoardIndex],
        objects: state.objects,
        lines: state.lines
      };
    }
    const targetBoard = updatedBoards[index];
    if (!targetBoard) return { boards: updatedBoards };
    return {
      boards: updatedBoards,
      currentBoardIndex: index,
      objects: targetBoard.objects,
      lines: targetBoard.lines,
      selectedObject: null,
      selectedLineId: null,
      selectedTool: null
    };
  }),
  createNextBoard: (newObjects) => set((state) => {
    const updatedBoards = [...state.boards];
    if (updatedBoards.length === 0) {
      updatedBoards.push({ id: "0", index: 0, objects: state.objects, lines: state.lines });
    } else {
      updatedBoards[state.currentBoardIndex] = {
        ...updatedBoards[state.currentBoardIndex],
        objects: state.objects,
        lines: state.lines
      };
    }
    const newIndex = state.currentBoardIndex + 1;
    const newBoard: CoachBoard = {
      id: Date.now().toString(),
      index: newIndex,
      objects: newObjects,
      lines: []
    };
    const finalBoards = [...updatedBoards.slice(0, newIndex), newBoard];
    return {
      boards: finalBoards,
      currentBoardIndex: newIndex,
      objects: newBoard.objects,
      lines: newBoard.lines,
      selectedObject: null,
      selectedLineId: null,
      selectedTool: null
    };
  }),
  deleteCurrentBoard: () => set((state) => {
    if (state.boards.length <= 1) return state;
    const newBoards = [...state.boards];
    newBoards.splice(state.currentBoardIndex, 1);
    newBoards.forEach((b, i) => b.index = i);
    const newIndex = Math.min(state.currentBoardIndex, newBoards.length - 1);
    const targetBoard = newBoards[newIndex];
    return {
      boards: newBoards,
      currentBoardIndex: newIndex,
      objects: targetBoard.objects,
      lines: targetBoard.lines,
      selectedObject: null,
      selectedLineId: null,
      selectedTool: null
    };
  })
}));
