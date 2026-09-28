import { create } from "zustand";
import { TopMenuEnums } from "../types/enums";

export interface BottomMenuItem {
  id: TopMenuEnums;
  label: string;
  iconName: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

export interface TopMenuItem {
  id: TopMenuEnums | string;
  name: string;
  onPress: () => void;
  children?: any;
}

export interface HeaderAction {
  label: string;
  iconName?: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

export interface MenuStoreState {
  activeTab: TopMenuEnums;
  headerTitle: string;
  headerAction: HeaderAction | null;
  bottomMenuItems: BottomMenuItem[];
  topMenu: TopMenuEnums | TopMenuItem[];
  topMenuItems: TopMenuItem[];

  setActiveTab: (tab: TopMenuEnums) => void;
  setHeaderTitle: (title: string) => void;
  setHeaderAction: (action: HeaderAction | null) => void;
  setBottomMenu: (items: BottomMenuItem[]) => void;
  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => void;
}

export const useMenuStore = create<MenuStoreState>((set) => ({
  activeTab: TopMenuEnums.MAIN,
  headerTitle: "Gestión de Equipos",
  headerAction: null,
  bottomMenuItems: [],
  topMenu: TopMenuEnums.MAIN,
  topMenuItems: [],

  setActiveTab: (tab: TopMenuEnums) => set({ activeTab: tab }),
  setHeaderTitle: (title: string) => set({ headerTitle: title }),
  setHeaderAction: (action: HeaderAction | null) => set({ headerAction: action }),
  setBottomMenu: (items: BottomMenuItem[]) => set({ bottomMenuItems: items }),

  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => {
    if (Array.isArray(menu)) {
      set({ topMenu: TopMenuEnums.ROSTER, topMenuItems: menu });
    } else {
      set({ activeTab: menu, topMenu: menu, topMenuItems: [] });
    }
  },
}));

export default useMenuStore;
