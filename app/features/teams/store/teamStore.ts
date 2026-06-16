import { create } from "zustand";
import { Team } from "../types";

interface TeamStoreState {
  team: Team | null;
  setTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamStoreState>((set) => ({
  team: null,
  setTeam: (team) => set({ team }),
}));
