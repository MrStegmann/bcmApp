import {
  SuppressionContext,
  SuppressionDecision,
  INotificationEvaluator,
} from "../types";

export class NotificationEvaluator implements INotificationEvaluator {
  evaluate(context: SuppressionContext): SuppressionDecision {
    const { appState, isMatchActive, settings } = context;

    // When the app is in the background or device locked/inactive, OS handles notifications
    if (appState !== "active") {
      return {
        shouldSuppress: false,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        reason: "none",
      };
    }

    // App is active in foreground:
    if (isMatchActive && settings.muteInMatch) {
      return {
        shouldSuppress: true,
        shouldShowAlert: false,
        shouldPlaySound: settings.soundEnabled,
        shouldSetBadge: true,
        reason: "match",
      };
    }

    if (!isMatchActive && settings.muteInApp) {
      return {
        shouldSuppress: true,
        shouldShowAlert: false,
        shouldPlaySound: settings.soundEnabled,
        shouldSetBadge: true,
        reason: "foreground",
      };
    }

    // Neither match nor general in-app suppression triggered
    return {
      shouldSuppress: false,
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      reason: "none",
    };
  }
}

export const notificationEvaluator = new NotificationEvaluator();

export function evaluateSuppression(context: SuppressionContext): SuppressionDecision {
  return notificationEvaluator.evaluate(context);
}
