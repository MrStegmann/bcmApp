import { create } from "zustand";
import clientApi from "../helpers/ClientApi";
import { useAuthStore } from "./AuthStore";

export const useTeamStore = create((set) => ({
  team: null,
  loading: false,
  setTeam: (team) => set({ team }),
  fetchTeamDataByCoach: async (coachId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(`/teams/${coachId}`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchTeams: async (clubId) => {
    set({ loading: true });

    const tokenFromStore = useAuthStore.getState().user?.token;

    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      const response = await clientApi.get(
        `/teams/getclubteams/${clubId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  saveTeam: async (teamData) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;

    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      await clientApi.post("/teams", teamData, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteTeam: async (teamId) => {
    set({ loading: true });
    const tokenFromStore = useAuthStore.getState().user?.token;
    try {
      if (!tokenFromStore) {
        throw new Error("No authentication token provided");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore}`,
        },
      };
      await clientApi.delete(`/teams/${teamId}`, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
