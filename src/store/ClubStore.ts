import { create } from "zustand";
import { db, teams } from "../db";
import { Team, NewTeam } from "../types/database";
import { eq } from "drizzle-orm";

export interface ClubStoreState {
  club: Team | null;
  currentTeam: Team | null;
  teamsList: Team[];
  clubs: Team[];
  isLoading: boolean;
  error: string | null;

  setClub: (club: Team | null) => void;
  setCurrentTeam: (team: Team | null) => void;
  fetchTeams: () => Promise<Team[]>;
  selectTeam: (teamId: number) => void;
  createTeam: (teamData: NewTeam) => Promise<Team | null>;
  updateTeam: (teamId: number, teamData: Partial<NewTeam>) => Promise<Team | null>;
  deleteTeam: (teamId: number) => Promise<boolean>;
}

export const useClubStore = create<ClubStoreState>((set, get) => ({
  club: null,
  currentTeam: null,
  teamsList: [],
  clubs: [],
  isLoading: false,
  error: null,

  setClub: (club: Team | null) => set({ club, currentTeam: club }),
  setCurrentTeam: (team: Team | null) => set({ currentTeam: team, club: team }),

  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.select().from(teams);
      set({ teamsList: result, clubs: result, isLoading: false });
      return result;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch teams", isLoading: false });
      return [];
    }
  },

  selectTeam: (teamId: number) => {
    const team = get().teamsList.find((t) => t.id === teamId) || null;
    set({ currentTeam: team, club: team });
  },

  createTeam: async (teamData: NewTeam) => {
    set({ isLoading: true, error: null });
    try {
      const [newTeam] = await db.insert(teams).values(teamData).returning();
      const updatedList = [...get().teamsList, newTeam];
      set({
        teamsList: updatedList,
        clubs: updatedList,
        currentTeam: null,
        club: null,
        isLoading: false,
      });
      return newTeam;
    } catch (err: any) {
      set({ error: err.message || "Failed to create team", isLoading: false });
      return null;
    }
  },

  updateTeam: async (teamId: number, teamData: Partial<NewTeam>) => {
    set({ isLoading: true, error: null });
    try {
      const [updatedTeam] = await db
        .update(teams)
        .set(teamData)
        .where(eq(teams.id, teamId))
        .returning();
      const updatedList = get().teamsList.map((t) => (t.id === teamId ? updatedTeam : t));
      const isCurrent = get().currentTeam?.id === teamId;
      set({
        teamsList: updatedList,
        clubs: updatedList,
        currentTeam: isCurrent ? updatedTeam : get().currentTeam,
        club: isCurrent ? updatedTeam : get().club,
        isLoading: false,
      });
      return updatedTeam;
    } catch (err: any) {
      set({ error: err.message || "Failed to update team", isLoading: false });
      return null;
    }
  },

  deleteTeam: async (teamId: number) => {
    set({ isLoading: true, error: null });
    try {
      await db.delete(teams).where(eq(teams.id, teamId));
      const updatedList = get().teamsList.filter((t) => t.id !== teamId);
      set({
        teamsList: updatedList,
        clubs: updatedList,
        currentTeam: null,
        club: null,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete team", isLoading: false });
      return false;
    }
  },
}));

export default useClubStore;
