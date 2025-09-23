// src/store/useCounterStore.js
import { create } from "zustand";

export const useMenuStore = create((set) => ({
  topMenu: [], // { id: null, name: "", onPress: null, children: null }
  setTopMenu: (topMenu) => set({ topMenu }), // función para cambiarlo
}));
