import { create } from "zustand";
import clientApi from "../helpers/ClientApi";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (userData) => set({ user: userData }),

  // connection method
  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await clientApi.post(
        "/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      set({ user: response.data });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const response = await clientApi.post("/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });
      set({ user: response.data });
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },
  verify: async (data) => {
    set({ loading: true });
    try {
      const response = await clientApi.post("/verify", data, {
        headers: { "Content-Type": "application/json" },
      });
      set({ user: response.data });
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  recover: async (email) => {
    set({ loading: true });
    try {
      const response = await clientApi.post(
        "/auth/recover",
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      set({ user: response.data });
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    } finally {
      set({ loading: false });
    }
  },

  logout: () => set({ user: null }),
}));
