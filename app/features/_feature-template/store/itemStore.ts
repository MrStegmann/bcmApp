import { create } from "zustand";
import { Item } from "../types";

interface ItemStoreState {
  item: Item | null;
  setItem: (item: Item | null) => void;
}

export const useItemStore = create<ItemStoreState>((set) => ({
  item: null,
  setItem: (item) => set({ item }),
}));
