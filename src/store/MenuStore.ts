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

export interface HeaderBackAction {
  label?: string;
  iconName?: string;
  iconFamily?: "Entypo" | "Feather" | "MaterialIcons" | "Foundation" | "MaterialCommunityIcons" | "FontAwesome5";
  onPress: () => void;
  testID?: string;
}

export interface MatchHeaderInfo {
  teamName: string;
  teamScore: number;
  rivalScore: number;
  rivalName: string;
  scoreOnly?: boolean;
}

export interface MenuStoreState {
  activeTab: TopMenuEnums;
  headerTitle: string;
  headerAction: HeaderAction | null;
  headerBackAction: HeaderBackAction | null;
  headerCustomComponent: React.ReactNode | null;
  matchHeaderInfo: MatchHeaderInfo | null;
  bottomMenuItems: BottomMenuItem[];
  topMenu: TopMenuEnums | TopMenuItem[];
  topMenuItems: TopMenuItem[];

  setActiveTab: (tab: TopMenuEnums) => void;
  setHeaderTitle: (title: string) => void;
  setHeaderAction: (action: HeaderAction | null) => void;
  setHeaderBackAction: (action: HeaderBackAction | null) => void;
  setHeaderCustomComponent: (component: React.ReactNode | null) => void;
  setMatchHeaderInfo: (info: MatchHeaderInfo | null) => void;
  setBottomMenu: (items: BottomMenuItem[]) => void;
  setTopMenu: (menu: TopMenuEnums | TopMenuItem[]) => void;
}

export const useMenuStore = create<MenuStoreState>((set) => ({
  activeTab: TopMenuEnums.MAIN,
  headerTitle: "Gestión de Equipos",
  headerAction: null,
  headerBackAction: null,
  headerCustomComponent: null,
  matchHeaderInfo: null,
  bottomMenuItems: [],
  topMenu: TopMenuEnums.MAIN,
  topMenuItems: [],

  setActiveTab: (tab: TopMenuEnums) => set({ activeTab: tab }),
  setHeaderTitle: (title: string) => set({ headerTitle: title, headerCustomComponent: null }),
  setHeaderAction: (action: HeaderAction | null) => set({ headerAction: action }),
  setHeaderBackAction: (action: HeaderBackAction | null) => set({ headerBackAction: action }),
  setHeaderCustomComponent: (component: React.ReactNode | null) => set({ headerCustomComponent: component }),
  setMatchHeaderInfo: (info: MatchHeaderInfo | null) => set({ matchHeaderInfo: info }),
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

