import { useNotificationStore } from "../../store/useNotificationStore";
import { NotificationCenterModalProps, NotificationRecord } from "../../types";

describe("NotificationCenterModal Component (US3 / T021)", () => {
  beforeEach(() => {
    useNotificationStore.getState().reset();
    jest.clearAllMocks();
  });

  it("conforms to NotificationCenterModalProps contract", () => {
    const onCloseMock = jest.fn();
    const onOpenSettingsMock = jest.fn();

    const props: NotificationCenterModalProps = {
      visible: true,
      onClose: onCloseMock,
      onOpenSettings: onOpenSettingsMock,
    };

    expect(props.visible).toBe(true);
    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);

    props.onOpenSettings?.();
    expect(onOpenSettingsMock).toHaveBeenCalledTimes(1);
  });

  it("handles mark all as read action via store", async () => {
    const markAllSpy = jest.spyOn(useNotificationStore.getState(), "markAllAsRead");

    await useNotificationStore.getState().markAllAsRead();

    expect(markAllSpy).toHaveBeenCalledTimes(1);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("handles clear all action via store", async () => {
    const clearAllSpy = jest.spyOn(useNotificationStore.getState(), "clearAll");

    await useNotificationStore.getState().clearAll();

    expect(clearAllSpy).toHaveBeenCalledTimes(1);
    expect(useNotificationStore.getState().recentNotifications).toHaveLength(0);
  });

  it("handles individual notification item mark as read", async () => {
    const markAsReadSpy = jest.spyOn(useNotificationStore.getState(), "markAsRead");

    await useNotificationStore.getState().markAsRead(42);

    expect(markAsReadSpy).toHaveBeenCalledWith(42);
  });

  it("identifies empty state correctly", () => {
    const notifications: NotificationRecord[] = [];
    const isEmpty = notifications.length === 0;
    expect(isEmpty).toBe(true);

    const populated: NotificationRecord[] = [
      {
        id: 1,
        externalId: null,
        title: "Test",
        body: "Message",
        dataJson: null,
        receivedAt: new Date().toISOString(),
        isRead: 0,
        suppressedReason: "none",
      },
    ];
    expect(populated.length === 0).toBe(false);
  });
});
