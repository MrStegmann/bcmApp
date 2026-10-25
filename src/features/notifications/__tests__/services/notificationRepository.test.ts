import { notificationRepository } from "../../db/repository";
import { db } from "../../../../db";
import { notifications, notificationSettings } from "../../db/schema";

describe("NotificationRepository (US3 & US4)", () => {
  beforeEach(async () => {
    await db.delete(notifications);
    await db.delete(notificationSettings);
  });

  it("saves a notification with defaults and retrieves it", async () => {
    const saved = await notificationRepository.saveNotification({
      title: "Prueba Partido",
      body: "Inicio de cuarto 3",
      suppressedReason: "match",
    });

    expect(saved.id).toBeGreaterThan(0);
    expect(saved.title).toBe("Prueba Partido");
    expect(saved.body).toBe("Inicio de cuarto 3");
    expect(saved.isRead).toBe(0);
    expect(saved.suppressedReason).toBe("match");

    const list = await notificationRepository.listNotifications();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(saved.id);
  });

  it("calculates unread count correctly and marks notifications as read", async () => {
    const n1 = await notificationRepository.saveNotification({
      title: "Notif 1",
      body: "Cuerpo 1",
    });
    const n2 = await notificationRepository.saveNotification({
      title: "Notif 2",
      body: "Cuerpo 2",
    });

    let unread = await notificationRepository.getUnreadCount();
    expect(unread).toBe(2);

    await notificationRepository.markAsRead(n1.id);
    unread = await notificationRepository.getUnreadCount();
    expect(unread).toBe(1);

    await notificationRepository.markAllAsRead();
    unread = await notificationRepository.getUnreadCount();
    expect(unread).toBe(0);
  });

  it("clears all notifications", async () => {
    await notificationRepository.saveNotification({ title: "N1", body: "B1" });
    await notificationRepository.saveNotification({ title: "N2", body: "B2" });

    let list = await notificationRepository.listNotifications();
    expect(list).toHaveLength(2);

    await notificationRepository.clearAll();
    list = await notificationRepository.listNotifications();
    expect(list).toHaveLength(0);
  });

  it("loads default settings and updates them", async () => {
    const settings = await notificationRepository.getSettings();
    expect(settings.muteInApp).toBe(true);
    expect(settings.muteInMatch).toBe(true);
    expect(settings.soundEnabled).toBe(false);

    const updated = await notificationRepository.saveSettings({
      muteInApp: false,
      soundEnabled: true,
    });
    expect(updated.muteInApp).toBe(false);
    expect(updated.soundEnabled).toBe(true);
    expect(updated.muteInMatch).toBe(true);

    const reloaded = await notificationRepository.getSettings();
    expect(reloaded.muteInApp).toBe(false);
    expect(reloaded.soundEnabled).toBe(true);
    expect(reloaded.muteInMatch).toBe(true);
  });
});
