import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { AuthData } from "../types";

type AuthStoreState = {
  auth: AuthData | null;
  saveAuth: (payload: AuthData) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStoreState>()((set) => ({
  auth: null,
  saveAuth: (payload) => {
    set({
      auth: {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        token: payload.token,
        role: payload.role,
        id: payload.id,
      },
    });
    AsyncStorage.setItem("auth", JSON.stringify(payload)).catch((error) => {
      console.error("Failed to save auth data to AsyncStorage:", error);
    });
  },
  clearAuth: () => {
    set({ auth: null });
    AsyncStorage.removeItem("auth").catch((error) => {
      console.error("Failed to clear auth data from AsyncStorage:", error);
    });
  },
}));
