import { create } from "zustand";
import TokenEnums from "../Enums/TokenEnums";
import { useAuthStore } from "./AuthStore";
import clientApi from "../helpers/ClientApi";

export const usePlaybookStore = create((set, get) => ({
  loading: false,

  activeTool: "",
  setActiveTool: (activeTool) => set({ activeTool }),

  halfCourt: true,
  setHalfCourt: (halfCourt) => set({ halfCourt }),

  selectedObject: null,
  setSelectedObject: (selectedObject) => set({ selectedObject }),

  fetchAll: async () => {
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
      const response = await clientApi.get(`/playbooks`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  savePlaybook: async (data) => {
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

      await clientApi.post("/playbooks", data, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteExercice: async (id) => {
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
      await clientApi.delete(`/playbooks/${id}`, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
