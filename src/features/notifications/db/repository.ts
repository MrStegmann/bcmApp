import { db } from "../../../db";
import { notifications, notificationSettings } from "./schema";
import { eq, desc, count } from "drizzle-orm";
import {
  INotificationRepository,
  NotificationRecord,
  NewNotificationRecord,
  NotificationSettings,
  SuppressedReason,
} from "../types";

export class NotificationRepository implements INotificationRepository {
  async saveNotification(record: NewNotificationRecord): Promise<NotificationRecord> {
    const payload = {
      externalId: record.externalId ?? null,
      title: record.title || "Notificación",
      body: record.body || "",
      dataJson: record.dataJson ?? null,
      receivedAt: record.receivedAt ?? new Date().toISOString(),
      isRead: record.isRead ? 1 : 0,
      suppressedReason: record.suppressedReason ?? "none",
    };
    const [inserted] = await db.insert(notifications).values(payload).returning();
    return {
      ...inserted,
      suppressedReason: inserted.suppressedReason as SuppressedReason,
    };
  }

  async listNotifications(limit = 50, offset = 0): Promise<NotificationRecord[]> {
    const rows = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.receivedAt), desc(notifications.id))
      .limit(limit)
      .offset(offset);

    return rows.map((r) => ({
      ...r,
      suppressedReason: r.suppressedReason as SuppressedReason,
    }));
  }

  async getUnreadCount(): Promise<number> {
    const rows = await db
      .select({ val: count() })
      .from(notifications)
      .where(eq(notifications.isRead, 0));
    return rows[0]?.val ?? 0;
  }

  async markAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.id, id));
  }

  async markAllAsRead(): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.isRead, 0));
  }

  async clearAll(): Promise<void> {
    await db.delete(notifications);
  }

  async getSettings(): Promise<NotificationSettings> {
    const rows = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.id, 1));

    if (rows.length === 0) {
      const defaultSettings = {
        id: 1,
        muteInApp: 1,
        muteInMatch: 1,
        soundEnabled: 0,
        updatedAt: new Date().toISOString(),
      };
      try {
        await db.insert(notificationSettings).values(defaultSettings);
      } catch {
        // In case of concurrent execution
      }
      return {
        muteInApp: true,
        muteInMatch: true,
        soundEnabled: false,
        updatedAt: defaultSettings.updatedAt,
      };
    }

    const row = rows[0];
    return {
      muteInApp: Boolean(row.muteInApp),
      muteInMatch: Boolean(row.muteInMatch),
      soundEnabled: Boolean(row.soundEnabled),
      updatedAt: row.updatedAt,
    };
  }

  async saveSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const current = await this.getSettings();
    const updated: NotificationSettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    const rowValues = {
      muteInApp: updated.muteInApp ? 1 : 0,
      muteInMatch: updated.muteInMatch ? 1 : 0,
      soundEnabled: updated.soundEnabled ? 1 : 0,
      updatedAt: updated.updatedAt!,
    };

    const rows = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.id, 1));

    if (rows.length === 0) {
      await db.insert(notificationSettings).values({ id: 1, ...rowValues });
    } else {
      await db
        .update(notificationSettings)
        .set(rowValues)
        .where(eq(notificationSettings.id, 1));
    }

    return updated;
  }
}

export const notificationRepository = new NotificationRepository();
