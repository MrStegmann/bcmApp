import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { useNotificationStore } from "../store/useNotificationStore";
import { notificationManager } from "../services/notificationManager";

export function handleAppStateChange(nextAppState: AppStateStatus): void {
  useNotificationStore.getState().setAppState(nextAppState);
}

export function useNotificationLifecycle(): void {
  useEffect(() => {
    notificationManager.init();

    let removeListener: (() => void) | undefined;
    try {
      // Dynamic import to prevent module evaluation issues during unit testing
      const { AppState } = require("react-native");
      const subscription = AppState.addEventListener("change", handleAppStateChange);
      removeListener = () => subscription?.remove?.();
    } catch {
      // Fallback in headless or testing environments
    }

    return () => {
      removeListener?.();
      notificationManager.destroy();
    };
  }, []);
}
