import type { AppStateStatus } from "react-native";
import {
  handleAppStateChange,
  useNotificationLifecycle,
} from "../../hooks/useNotificationLifecycle";
import { useNotificationStore } from "../../store/useNotificationStore";
import { notificationManager } from "../../services/notificationManager";

describe("useNotificationLifecycle (US2)", () => {
  beforeEach(() => {
    useNotificationStore.getState().reset();
    jest.clearAllMocks();
  });

  it("updates store appState when handleAppStateChange is invoked with various states", () => {
    expect(useNotificationStore.getState().appState).toBe("active");

    handleAppStateChange("background" as AppStateStatus);
    expect(useNotificationStore.getState().appState).toBe("background");

    handleAppStateChange("inactive" as AppStateStatus);
    expect(useNotificationStore.getState().appState).toBe("inactive");

    handleAppStateChange("active" as AppStateStatus);
    expect(useNotificationStore.getState().appState).toBe("active");
  });

  it("triggers notificationManager.init when hook effect is mounted", () => {
    const initSpy = jest.spyOn(notificationManager, "init").mockResolvedValue();
    const destroySpy = jest.spyOn(notificationManager, "destroy").mockReturnValue();

    let cleanup: (() => void) | void = undefined;
    jest.spyOn(require("react"), "useEffect").mockImplementationOnce((effect: any) => {
      cleanup = effect();
    });

    useNotificationLifecycle();

    expect(initSpy).toHaveBeenCalled();

    if (typeof cleanup === "function") {
      (cleanup as () => void)();
      expect(destroySpy).toHaveBeenCalled();
    }
  });
});
