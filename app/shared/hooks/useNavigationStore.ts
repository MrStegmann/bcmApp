import React from "react";
import { AppRoutes } from "../../navigation";
import { create } from "zustand";

export type NavigationItem = {
  label: string;
  path: keyof typeof AppRoutes;
  icon: React.ReactNode | null;
};

interface NavigationState {
  navigationItems: NavigationItem[];
  setNavigationItems: (items: NavigationItem[]) => void;
  pendingRoute: keyof typeof AppRoutes | null;
  pendingParams: any;
  setPendingRoute: (route: keyof typeof AppRoutes, params?: any) => void;
  clearPendingRoute: () => void;
  isNavVisible: boolean;
  setNavVisible: (visible: boolean) => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  navigationItems: [],
  setNavigationItems: (items) => set({ navigationItems: items }),
  pendingRoute: null,
  pendingParams: undefined,
  setPendingRoute: (route, params) => set({ pendingRoute: route, pendingParams: params }),
  clearPendingRoute: () => set({ pendingRoute: null, pendingParams: undefined }),
  isNavVisible: true,
  setNavVisible: (visible) => set({ isNavVisible: visible }),
}));

export { useNavigationStore };
