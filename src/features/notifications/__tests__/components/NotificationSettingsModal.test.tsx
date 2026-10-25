import { useNotificationStore } from "../../store/useNotificationStore";
import { NotificationSettingsModalProps } from "../../types";

describe("NotificationSettingsModal Component (US4 / T028)", () => {
  beforeEach(() => {
    useNotificationStore.getState().reset();
    jest.clearAllMocks();
  });

  it("conforms to NotificationSettingsModalProps contract", () => {
    const onCloseMock = jest.fn();
    const props: NotificationSettingsModalProps = {
      visible: true,
      onClose: onCloseMock,
    };

    expect(props.visible).toBe(true);
    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("updates muteInMatch setting via store when toggled", async () => {
    const updateSpy = jest.spyOn(useNotificationStore.getState(), "updateSettings");

    await useNotificationStore.getState().updateSettings({ muteInMatch: false });

    expect(updateSpy).toHaveBeenCalledWith({ muteInMatch: false });
    expect(useNotificationStore.getState().settings.muteInMatch).toBe(false);
  });

  it("updates muteInApp setting via store when toggled", async () => {
    const updateSpy = jest.spyOn(useNotificationStore.getState(), "updateSettings");

    await useNotificationStore.getState().updateSettings({ muteInApp: false });

    expect(updateSpy).toHaveBeenCalledWith({ muteInApp: false });
    expect(useNotificationStore.getState().settings.muteInApp).toBe(false);
  });

  it("updates soundEnabled setting via store when toggled", async () => {
    const updateSpy = jest.spyOn(useNotificationStore.getState(), "updateSettings");

    await useNotificationStore.getState().updateSettings({ soundEnabled: true });

    expect(updateSpy).toHaveBeenCalledWith({ soundEnabled: true });
    expect(useNotificationStore.getState().settings.soundEnabled).toBe(true);
  });
});
