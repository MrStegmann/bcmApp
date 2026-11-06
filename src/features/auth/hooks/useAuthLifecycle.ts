import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthLifecycle(): void {
  useEffect(() => {
    async function init() {
      const isValid = await useAuthStore.getState().checkSession();
      if (!isValid) {
        await useAuthStore.getState().initBiometricsAndRememberedUser();
      }
    }
    init();
  }, []);
}
