import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNotificationStore } from "../store/useNotificationStore";
import { NotificationCenterModalProps, NotificationRecord } from "../types";

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  visible,
  onClose,
  onOpenSettings,
}) => {
  const recentNotifications = useNotificationStore(
    (state) => state.recentNotifications
  );
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const refreshNotifications = useNotificationStore(
    (state) => state.refreshNotifications
  );

  useEffect(() => {
    if (visible) {
      refreshNotifications();
    }
  }, [visible, refreshNotifications]);

  const formatTimestamp = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const renderItem = ({ item }: { item: NotificationRecord }) => {
    const isUnread = item.isRead === 0;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isUnread) {
            markAsRead(item.id);
          }
        }}
        activeOpacity={0.7}
        className={`p-3.5 mb-2.5 rounded-xl border ${
          isUnread
            ? "bg-gray-800 border-amber-500/40"
            : "bg-gray-900/80 border-gray-800"
        }`}
        testID={`notification-item-${item.id}`}
      >
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center flex-1 mr-2">
            {isUnread && (
              <View className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
            )}
            <Text
              className="text-white font-bold text-sm flex-1"
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </View>
          <Text className="text-gray-400 text-xs">
            {formatTimestamp(item.receivedAt)}
          </Text>
        </View>

        <Text className="text-gray-300 text-xs leading-relaxed">
          {item.body}
        </Text>

        {item.suppressedReason !== "none" && (
          <View className="flex-row items-center mt-2">
            <View className="bg-gray-700/60 px-2 py-0.5 rounded-md flex-row items-center">
              <Feather
                name={item.suppressedReason === "match" ? "shield" : "bell-off"}
                size={10}
                color="#9ca3af"
              />
              <Text className="text-gray-400 text-[10px] ml-1">
                {item.suppressedReason === "match"
                  ? "Silenciada durante partido"
                  : "Silenciada en app"}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-gray-950">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-gray-800 bg-gray-900">
          <View className="flex-row items-center">
            <Feather name="bell" size={20} color="#f59e0b" />
            <Text className="text-white text-lg font-bold ml-2">
              Notificaciones
            </Text>
            {unreadCount > 0 && (
              <View className="bg-red-600 rounded-full px-2 py-0.5 ml-2">
                <Text className="text-white text-xs font-bold">
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center space-x-2">
            {onOpenSettings && (
              <TouchableOpacity
                onPress={onOpenSettings}
                className="w-9 h-9 items-center justify-center rounded-lg bg-gray-800 mr-2"
                testID="notification-settings-btn"
                accessibilityLabel="Ajustes de notificaciones"
              >
                <Feather name="settings" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 items-center justify-center rounded-lg bg-gray-800"
              testID="notification-center-close-btn"
              accessibilityLabel="Cerrar"
            >
              <Feather name="x" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Bar */}
        {recentNotifications.length > 0 && (
          <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-800/60 bg-gray-900/40">
            <TouchableOpacity
              onPress={() => markAllAsRead()}
              className="flex-row items-center py-1"
              testID="mark-all-read-btn"
            >
              <Feather name="check" size={14} color="#f59e0b" />
              <Text className="text-amber-400 text-xs font-semibold ml-1.5">
                Marcar todo como leído
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => clearAll()}
              className="flex-row items-center py-1"
              testID="clear-all-btn"
            >
              <Feather name="trash-2" size={14} color="#ef4444" />
              <Text className="text-red-400 text-xs font-semibold ml-1.5">
                Limpiar historial
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content List */}
        <View className="flex-1 px-4 pt-3">
          {recentNotifications.length === 0 ? (
            <View
              className="flex-1 items-center justify-center py-12"
              testID="notifications-empty-state"
            >
              <View className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 items-center justify-center mb-4">
                <Feather name="bell-off" size={28} color="#6b7280" />
              </View>
              <Text className="text-white text-base font-bold mb-1">
                Sin notificaciones
              </Text>
              <Text className="text-gray-400 text-xs text-center max-w-[240px]">
                Las notificaciones silenciadas se guardarán aquí para consultarlas
                cuando desees.
              </Text>
            </View>
          ) : (
            <FlatList
              data={recentNotifications}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
