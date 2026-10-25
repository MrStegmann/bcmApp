import { useNotificationStore } from "../../store/useNotificationStore";
import { notificationRepository } from "../../db/repository";

describe("useNotificationStore (US1)", () => {
  beforeEach(() => {
    useNotificationStore.getState().reset();
    jest.clearAllMocks();
  });

  it("updates match active status and activeMatchId", () => {
    const store = useNotificationStore.getState();
    expect(store.isMatchActive).toBe(false);
    expect(store.activeMatchId).toBeNull();

    store.setMatchActive(true, 42);
    expect(useNotificationStore.getState().isMatchActive).toBe(true);
    expect(useNotificationStore.getState().activeMatchId).toBe(42);

    store.setMatchActive(false);
    expect(useNotificationStore.getState().isMatchActive).toBe(false);
    expect(useNotificationStore.getState().activeMatchId).toBeNull();
  });

  it("updates app state", () => {
    const store = useNotificationStore.getState();
    expect(store.appState).toBe("active");

    store.setAppState("background");
    expect(useNotificationStore.getState().appState).toBe("background");

    store.setAppState("inactive");
    expect(useNotificationStore.getState().appState).toBe("inactive");
  });

  it("loads settings from repository", async () => {
    jest.spyOn(notificationRepository, "getSettings").mockResolvedValueOnce({
      muteInApp: true,
      muteInMatch: true,
      soundEnabled: true,
      updatedAt: "2026-10-25T10:00:00.000Z",
    });

    await useNotificationStore.getState().loadSettings();

    const state = useNotificationStore.getState();
    expect(state.isSettingsLoaded).toBe(true);
    expect(state.settings.soundEnabled).toBe(true);
  });

  it("updates settings via repository and reflects in state", async () => {
    jest.spyOn(notificationRepository, "saveSettings").mockResolvedValueOnce({
      muteInApp: false,
      muteInMatch: true,
      soundEnabled: false,
      updatedAt: "2026-10-25T10:05:00.000Z",
    });

    await useNotificationStore.getState().updateSettings({ muteInApp: false });

    expect(useNotificationStore.getState().settings.muteInApp).toBe(false);
  });

  it("adds received notification and increments unreadCount", async () => {
    jest.spyOn(notificationRepository, "saveNotification").mockResolvedValueOnce({
      id: 1,
      externalId: "ext-1",
      title: "Alerta de Partido",
      body: "El partido comenzará en 10 min",
      dataJson: JSON.stringify({ matchId: 42 }),
      receivedAt: "2026-10-25T10:10:00.000Z",
      isRead: 0,
      suppressedReason: "match",
    });

    const record = await useNotificationStore.getState().addReceivedNotification({
      externalId: "ext-1",
      title: "Alerta de Partido",
      body: "El partido comenzará en 10 min",
      data: { matchId: 42 },
      suppressedReason: "match",
    });

    expect(record.id).toBe(1);
    expect(useNotificationStore.getState().unreadCount).toBe(1);
    expect(useNotificationStore.getState().recentNotifications).toHaveLength(1);
  });
});
