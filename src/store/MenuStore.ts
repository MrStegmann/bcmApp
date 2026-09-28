import { create } from "zustand";
import { TopMenuEnums } from "../types/enums";

export interface TopMenuItem {
  id: TopMenuEnums | string;
  name: string;
  onPress: () => void;
  children?: any;
}

export interface MenuStoreState {
  activeTab: TopMenuEnums;
  topMenu: TopMenuEnums | TopMenuItem[];
  topMenuItems: TopMenuItem[];
  setActiveTab: (tab: TopMenuEnums) => void;
  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => void;
}

export const useMenuStore = create<MenuStoreState>((set) => ({
  activeTab: TopMenuEnums.ROSTER,
  topMenu: TopMenuEnums.ROSTER,
  topMenuItems: [],

  setActiveTab: (tab: TopMenuEnums) => set({ activeTab: tab, topMenu: tab }),
  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => {
    if (Array.isArray(menu)) {
      set({ topMenu: TopMenuEnums.ROSTER, topMenuItems: menu });
    } else {
      set({ activeTab: menu, topMenu: menu, topMenuItems: [] });
    }
  },
}));

export default useMenuStore;
