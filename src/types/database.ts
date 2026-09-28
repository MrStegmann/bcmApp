import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  teams,
  players,
  games,
  playerStats,
  trainings,
  trainingPlayers,
  fees,
} from "../db/schema";

export type Team = InferSelectModel<typeof teams>;
export type NewTeam = InferInsertModel<typeof teams>;

export type Player = InferSelectModel<typeof players>;
export type NewPlayer = InferInsertModel<typeof players>;

export type Game = InferSelectModel<typeof games>;
export type NewGame = InferInsertModel<typeof games>;

export type PlayerStat = InferSelectModel<typeof playerStats>;
export type NewPlayerStat = InferInsertModel<typeof playerStats>;

export type Training = InferSelectModel<typeof trainings>;
export type NewTraining = InferInsertModel<typeof trainings>;

export type TrainingPlayer = InferSelectModel<typeof trainingPlayers>;
export type NewTrainingPlayer = InferInsertModel<typeof trainingPlayers>;

export type Fee = InferSelectModel<typeof fees>;
export type NewFee = InferInsertModel<typeof fees>;
