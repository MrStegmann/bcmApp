import { evaluateSuppression } from "../../services/notificationEvaluator";
import { SuppressionContext } from "../../types";

describe("NotificationEvaluator (US1 & US2)", () => {
  it("suppresses popups during active match when muteInMatch is true", () => {
    const context: SuppressionContext = {
      appState: "active",
      isMatchActive: true,
      settings: {
        muteInApp: true,
        muteInMatch: true,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(context);

    expect(result.shouldSuppress).toBe(true);
    expect(result.shouldShowAlert).toBe(false);
    expect(result.shouldPlaySound).toBe(false);
    expect(result.shouldSetBadge).toBe(true);
    expect(result.reason).toBe("match");
  });

  it("suppresses popups during active match even if muteInApp is false when muteInMatch is true", () => {
    const context: SuppressionContext = {
      appState: "active",
      isMatchActive: true,
      settings: {
        muteInApp: false,
        muteInMatch: true,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(context);

    expect(result.shouldSuppress).toBe(true);
    expect(result.shouldShowAlert).toBe(false);
    expect(result.reason).toBe("match");
  });

  it("permits popups during active match if both muteInMatch and muteInApp are false", () => {
    const context: SuppressionContext = {
      appState: "active",
      isMatchActive: true,
      settings: {
        muteInApp: false,
        muteInMatch: false,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(context);

    expect(result.shouldSuppress).toBe(false);
    expect(result.shouldShowAlert).toBe(true);
    expect(result.reason).toBe("none");
  });

  it("suppresses popups in general foreground when muteInApp is true and no match is active", () => {
    const context: SuppressionContext = {
      appState: "active",
      isMatchActive: false,
      settings: {
        muteInApp: true,
        muteInMatch: true,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(context);

    expect(result.shouldSuppress).toBe(true);
    expect(result.shouldShowAlert).toBe(false);
    expect(result.reason).toBe("foreground");
  });

  it("permits popups in general foreground when muteInApp is false and no match is active", () => {
    const context: SuppressionContext = {
      appState: "active",
      isMatchActive: false,
      settings: {
        muteInApp: false,
        muteInMatch: true,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(context);

    expect(result.shouldSuppress).toBe(false);
    expect(result.shouldShowAlert).toBe(true);
    expect(result.reason).toBe("none");
  });

  it("permits system banners when app is in background regardless of match or in-app settings", () => {
    const backgroundContext: SuppressionContext = {
      appState: "background",
      isMatchActive: true,
      settings: {
        muteInApp: true,
        muteInMatch: true,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(backgroundContext);

    expect(result.shouldSuppress).toBe(false);
    expect(result.shouldShowAlert).toBe(true);
    expect(result.reason).toBe("none");
  });

  it("permits system banners when app is inactive", () => {
    const inactiveContext: SuppressionContext = {
      appState: "inactive",
      isMatchActive: false,
      settings: {
        muteInApp: true,
        muteInMatch: true,
        soundEnabled: false,
      },
    };

    const result = evaluateSuppression(inactiveContext);

    expect(result.shouldSuppress).toBe(false);
    expect(result.shouldShowAlert).toBe(true);
    expect(result.reason).toBe("none");
  });
});
