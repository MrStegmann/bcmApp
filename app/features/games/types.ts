import type { Player } from "../players/types";

export interface GamePeriod {
    period: number;
    teamScore: number;
    rivalScore: number;
}

export interface Game {
    id: string;
    teamId: string;
    rival: string;
    date: Date;
    round: string;
    location: string;
    teamScore: number;
    rivalScore: number;
    isPlayed: boolean;
    periods: GamePeriod[];
}


export interface GameRoster {
    id: string;
    gameId: string;
    playerIds: string[];
}

export type GameFormValues = {
    game?: Game
};