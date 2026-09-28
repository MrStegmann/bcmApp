import { create } from "zustand";

export interface AlertItem {
  id: string | number;
  msg: string;
  type?: "info" | "error" | "success";
}

export interface AlertStoreState {
  alerts: AlertItem[];
  addAlert: (msg: string, type?: "info" | "error" | "success") => void;
  removeAlert: (id: string | number) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  alerts: [],
  addAlert: (msg: string, type = "info") => {
    const id = Date.now().toString();
    set((state) => ({ alerts: [...state.alerts, { id, msg, type }] }));
    setTimeout(() => {
      set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) }));
    }, 3000);
  },
  removeAlert: (id: string | number) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  clearAlerts: () => set({ alerts: [] }),
}));

export default useAlertStore;
