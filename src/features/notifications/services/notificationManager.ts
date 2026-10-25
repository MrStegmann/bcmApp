import {
  INotificationManager,
  NotificationRecord,
  SuppressionDecision,
} from "../types";
import { useNotificationStore } from "../store/useNotificationStore";
import { evaluateSuppression } from "./notificationEvaluator";

export class NotificationManager implements INotificationManager {
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    await useNotificationStore.getState().loadSettings();
    await useNotificationStore.getState().refreshNotifications();
    this.isInitialized = true;
  }

  destroy(): void {
    this.isInitialized = false;
  }

  evaluateSuppression(): SuppressionDecision {
    const { appState, isMatchActive, settings } = useNotificationStore.getState();
    return evaluateSuppression({
      appState,
      isMatchActive,
      settings,
    });
  }

  async processIncomingNotification(rawPayload: {
    externalId?: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<NotificationRecord> {
    const decision = this.evaluateSuppression();

    const record = await useNotificationStore.getState().addReceivedNotification({
      externalId: rawPayload.externalId,
      title: rawPayload.title,
      body: rawPayload.body,
      data: rawPayload.data,
      suppressedReason: decision.reason,
    });

    return record;
  }
}

export const notificationManager = new NotificationManager();
