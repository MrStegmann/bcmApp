import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayerStats } from "../../players/types";

export interface GamePlayState {
  gameId: string;
  quarter: number;
  timeRemainingSeconds?: number; // Legacy
  timeRemainingByQuarter?: Record<number, number>;
  teamScore: number;
  rivalScore: number;
  quarterTeamScore: number;
  quarterRivalScore: number;
  courtPlayerIds: string[];
  plannedFives: {
    [quarter: number]: string[];
  };
  teamFoulsByQuarter: Record<number, number>;
  rivalFoulsByQuarter: Record<number, number>;
  playerStats: Record<string, PlayerStats>;
}

const STORAGE_PREFIX = "@game_play_";

export const getGamePlayState = async (gameId: string): Promise<GamePlayState | null> => {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_PREFIX}${gameId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading game state", error);
    return null;
  }
};

export const saveGamePlayState = async (state: GamePlayState): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${state.gameId}`, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving game state", error);
  }
};
