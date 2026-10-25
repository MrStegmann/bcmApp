import { create } from "zustand";
import { AppStateStatus } from "react-native";
import {
  NotificationRecord,
  NotificationSettings,
  NotificationPayload,
  SuppressedReason,
} from "../types";
import { notificationRepository } from "../db/repository";

export interface NotificationStoreState {
  // Ephemeral lifecycle & context
  appState: AppStateStatus;
  isMatchActive: boolean;
  activeMatchId: number | null;

  // Cached settings
  settings: NotificationSettings;
  isSettingsLoaded: boolean;

  // Inbox cache & counters
  unreadCount: number;
  recentNotifications: NotificationRecord[];

  // Actions
  setAppState: (state: AppStateStatus) => void;
  setMatchActive: (active: boolean, matchId?: number | null) => void;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
  addReceivedNotification: (payload: NotificationPayload) => Promise<NotificationRecord>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  reset: () => void;
}

const defaultSettings: NotificationSettings = {
  muteInApp: true,
  muteInMatch: true,
  soundEnabled: false,
};

const initialState = {
  appState: "active" as AppStateStatus,
  isMatchActive: false,
  activeMatchId: null as number | null,
  settings: defaultSettings,
  isSettingsLoaded: false,
  unreadCount: 0,
  recentNotifications: [] as NotificationRecord[],
};

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  ...initialState,

  setAppState: (appState: AppStateStatus) => {
    set({ appState });
  },

  setMatchActive: (isMatchActive: boolean, matchId: number | null = null) => {
    set({
      isMatchActive,
      activeMatchId: isMatchActive ? matchId : null,
    });
  },

  loadSettings: async () => {
    try {
      const settings = await notificationRepository.getSettings();
      set({ settings, isSettingsLoaded: true });
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      set({ settings: defaultSettings, isSettingsLoaded: true });
    }
  },

  updateSettings: async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updated = await notificationRepository.saveSettings(newSettings);
      set({ settings: updated });
    } catch (error) {
      console.error("Failed to update notification settings:", error);
    }
  },

  addReceivedNotification: async (payload: NotificationPayload) => {
    const record = await notificationRepository.saveNotification({
      externalId: payload.externalId ?? null,
      title: payload.title,
      body: payload.body,
      dataJson: payload.data ? JSON.stringify(payload.data) : null,
      receivedAt: new Date().toISOString(),
      isRead: 0,
      suppressedReason: payload.suppressedReason ?? ("none" as SuppressedReason),
    });

    set((state) => ({
      recentNotifications: [record, ...state.recentNotifications],
      unreadCount: state.unreadCount + 1,
    }));

    return record;
  },

  refreshNotifications: async () => {
    try {
      const [list, count] = await Promise.all([
        notificationRepository.listNotifications(),
        notificationRepository.getUnreadCount(),
      ]);
      set({ recentNotifications: list, unreadCount: count });
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  },

  markAsRead: async (id: number) => {
    try {
      await notificationRepository.markAsRead(id);
      set((state) => ({
        recentNotifications: state.recentNotifications.map((n) =>
          n.id === id ? { ...n, isRead: 1 } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationRepository.markAllAsRead();
      set((state) => ({
        recentNotifications: state.recentNotifications.map((n) => ({ ...n, isRead: 1 })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  },

  clearAll: async () => {
    try {
      await notificationRepository.clearAll();
      set({
        recentNotifications: [],
        unreadCount: 0,
      });
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  },

  reset: () => {
    set({ ...initialState });
  },
}));
