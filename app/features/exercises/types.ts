// Object son elementos sobre el CoachBoard, como por ejemplo un jugador defensivo, jugador ofensivo, un balón, conos, etc.
export interface Object {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  rotation?: number;
}

// Line presenta líneas dibujadas en el CoachBoard, como por ejemplo trayectorias de movimiento con o sin balón, pases, etc. Cada línea tiene un conjunto de puntos que representan su forma y posición en el tablero.
export interface Line {
  id: string;
  type: string;
  color: string;
  width: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  points: { index: number; x: number; y: number }[];
}

export interface CoachBoard {
  id: string;
  index: number;
  objects: Object[];
  lines: Line[];
}

export type Category = "Babybasket" | "Prebenjamín" | "Benjamín" | "Alevín" | "Infantil" | "Cadete" | "Juvenil" | "Senior" | "SUB-22"
export type Type = "Tactic" | "Technical" | "Cooperative"
export type GamePhase = "Attack" | "Defense" | "Transition"
export type Activity = "Tiro" | "Pases" | "Dribbling" | "Closeout" | "Bloqueos" | "Rebote" | "Defensa 1v1" | "Ayudas"

export enum ToolbarTool {
  OFFENSIVE = "offensive",
  DEFENSIVE = "defensive",
  BALL = "ball",
  CONE = "cone",
  HAND_BY_HAND = "handbyhand",
  MOVEMENT_LINE = "movement_line",
  DRIBBLING_LINE = "dribbling_line",
  PASS_LINE = "pass_line",
  SCREEN_LINE = "screen_line",
}

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  description?: string;
  alternatives?: string;
  category?: Category[];
  type?: Type[];
  gamePhase?: GamePhase[];
  activities: Activity[]; // Tiro, pases, dribbling, etc.
  likes: number;
  coachBoard: CoachBoard[];
}

export type ExerciseFormValues = {
  userId: string;
  name: string;
  description: string;
  alternatives: string;
  category: Category[];
  type: Type[];
  gamePhase: GamePhase[];
  activities: Activity[];
};
