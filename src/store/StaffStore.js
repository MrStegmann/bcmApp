import { create } from "zustand";
import clientApi from "../helpers/ClientApi";
import { useAuthStore } from "./AuthStore";
import { errorAlert, infoAlert } from "../helpers/AlertHelper";

export const useStaffStore = create((set) => ({
  loading: false,
  fetchStaffs: async (clubId) => {
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
      const response = await clientApi.get(`/staffs/${clubId}`, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  changeOwner: async (newOwnerId) => {
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
      await clientApi.post(`/staffs/change-owner/${newOwnerId}`, {}, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  changePassword: async (data) => {
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
      await clientApi.post(`/staffs/changePassword`, data, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  saveStaff: async (staffData) => {
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
      await clientApi.post("/staffs", staffData, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteStaff: async (staffId) => {
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
      await clientApi.delete(`/staffs/${staffId}`, config);
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
