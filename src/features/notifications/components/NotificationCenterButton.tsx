import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNotificationStore } from "../store/useNotificationStore";
import { NotificationCenterButtonProps } from "../types";

export const NotificationCenterButton: React.FC<NotificationCenterButtonProps> = ({
  onPress,
  testID = "notification-center-button",
}) => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const badgeText = unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 items-center justify-center rounded-xl bg-surface-elevated border border-slate-border active:bg-slate-border relative"
      testID={testID}
      accessibilityLabel="Centro de Notificaciones"
    >
      <Feather name="bell" size={20} color="#ffffff" />
      {badgeText ? (
        <View
          className="absolute -top-1.5 -right-1.5 bg-court-orange rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border border-slate-900"
          testID="notification-badge"
        >
          <Text className="text-slate-950 text-[10px] font-black">{badgeText}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
