import { create } from "zustand";
import clientApi from "../helpers/ClientApi";
import { useAuthStore } from "./AuthStore";

export const usePlayerStore = create((set) => ({
  loading: false,
  fetchPlayersByTeam: async (teamId) => {
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
      const response = await clientApi.get(`/players/${teamId}`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  savePlayer: async (playerData) => {
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
      await clientApi.post("/players", playerData, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  deletePlayer: async (playerId) => {
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
      await clientApi.delete(`/players/${playerId}`, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
