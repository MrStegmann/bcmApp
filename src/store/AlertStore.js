import { create } from "zustand";

export const useAlertStore = create((set, get) => ({
  alerts: [],

  // Adds an alert and schedules its removal
  addAlert: (item) => {
    set((state) => ({ alerts: [item, ...state.alerts] }));

    // Use setTimeout to remove the alert after its lifetime
    setTimeout(() => {
      // The `get()` method is used to get the current state
      const { removeAlert } = get();
      removeAlert(item.id);
    }, item.lifetime);
  },

  // Removes a specific alert by its ID
  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((al) => al.id !== id) })),
}));
