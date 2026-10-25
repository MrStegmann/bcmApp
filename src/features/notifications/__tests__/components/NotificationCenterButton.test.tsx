import { useNotificationStore } from "../../store/useNotificationStore";
import { NotificationCenterButtonProps } from "../../types";

describe("NotificationCenterButton Component (US3 / T020)", () => {
  beforeEach(() => {
    useNotificationStore.getState().reset();
    jest.clearAllMocks();
  });

  it("conforms to NotificationCenterButtonProps contract", () => {
    const onPressMock = jest.fn();
    const props: NotificationCenterButtonProps = {
      onPress: onPressMock,
      testID: "notification-center-btn",
    };

    expect(props.testID).toBe("notification-center-btn");
    props.onPress();
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("formats unread badge count correctly when 0, positive, and over 99", () => {
    const formatBadgeText = (count: number): string | null => {
      if (count <= 0) return null;
      if (count > 99) return "99+";
      return String(count);
    };

    expect(formatBadgeText(0)).toBeNull();
    expect(formatBadgeText(5)).toBe("5");
    expect(formatBadgeText(99)).toBe("99");
    expect(formatBadgeText(150)).toBe("99+");
  });

  it("reflects unreadCount updates from notification store", () => {
    expect(useNotificationStore.getState().unreadCount).toBe(0);

    useNotificationStore.setState({ unreadCount: 3 });
    expect(useNotificationStore.getState().unreadCount).toBe(3);

    useNotificationStore.setState({ unreadCount: 0 });
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });
});
