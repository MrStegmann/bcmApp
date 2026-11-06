import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function useAuthLifecycle(): void {
  useEffect(() => {
    useAuthStore.getState().checkSession();
  }, []);
}

