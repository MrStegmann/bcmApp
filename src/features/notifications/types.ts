import { AppStateStatus } from "react-native";

export type SuppressedReason = "foreground" | "match" | "none";

export interface NotificationRecord {
  id: number;
  externalId: string | null;
  title: string;
  body: string;
  dataJson: string | null;
  receivedAt: string;
  isRead: number;
  suppressedReason: SuppressedReason;
}

export interface NewNotificationRecord {
  externalId?: string | null;
  title: string;
  body: string;
  dataJson?: string | null;
  receivedAt?: string;
  isRead?: number;
  suppressedReason?: SuppressedReason;
}

export interface NotificationPayload {
  externalId?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  suppressedReason?: SuppressedReason;
}

export interface NotificationSettings {
  muteInApp: boolean;
  muteInMatch: boolean;
  soundEnabled: boolean;
  updatedAt?: string;
}

export interface SuppressionContext {
  appState: AppStateStatus;
  isMatchActive: boolean;
  settings: NotificationSettings;
}

export interface SuppressionDecision {
  shouldSuppress: boolean;
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
  reason: SuppressedReason;
}

export interface INotificationEvaluator {
  evaluate(context: SuppressionContext): SuppressionDecision;
}

export interface INotificationRepository {
  saveNotification(notification: NewNotificationRecord): Promise<NotificationRecord>;
  listNotifications(limit?: number, offset?: number): Promise<NotificationRecord[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: number): Promise<void>;
  markAllAsRead(): Promise<void>;
  clearAll(): Promise<void>;
  getSettings(): Promise<NotificationSettings>;
  saveSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings>;
}

export interface INotificationManager {
  init(): Promise<void>;
  destroy(): void;
  evaluateSuppression(): SuppressionDecision;
  processIncomingNotification(rawPayload: {
    externalId?: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<NotificationRecord>;
}

export interface NotificationCenterModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface NotificationCenterButtonProps {
  onPress: () => void;
  testID?: string;
}
