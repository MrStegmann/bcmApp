import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNotificationStore } from "../store/useNotificationStore";
import { NotificationSettingsModalProps } from "../types";

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const settings = useNotificationStore((state) => state.settings);
  const isSettingsLoaded = useNotificationStore((state) => state.isSettingsLoaded);
  const loadSettings = useNotificationStore((state) => state.loadSettings);
  const updateSettings = useNotificationStore((state) => state.updateSettings);

  useEffect(() => {
    if (visible && !isSettingsLoaded) {
      loadSettings();
    }
  }, [visible, isSettingsLoaded, loadSettings]);

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
            <Feather name="settings" size={20} color="#f59e0b" />
            <Text className="text-white text-lg font-bold ml-2">
              Ajustes de Notificaciones
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 items-center justify-center rounded-lg bg-gray-800"
            testID="notification-settings-close-btn"
            accessibilityLabel="Cerrar ajustes"
          >
            <Feather name="x" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Supresión de Ventanas Emergentes
          </Text>

          {/* Toggle: Mute in Match */}
          <View className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-8 h-8 rounded-lg bg-amber-500/10 items-center justify-center mr-3">
                  <Feather name="shield" size={16} color="#f59e0b" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">
                    Silenciar en partidos
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    Evita ventanas emergentes durante partidos activos para no
                    obstruir controles ni juego.
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.muteInMatch}
                onValueChange={(val) => updateSettings({ muteInMatch: val })}
                trackColor={{ false: "#374151", true: "#f59e0b" }}
                thumbColor="#ffffff"
                testID="toggle-mute-in-match"
              />
            </View>
          </View>

          {/* Toggle: Mute in App */}
          <View className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-8 h-8 rounded-lg bg-blue-500/10 items-center justify-center mr-3">
                  <Feather name="smartphone" size={16} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">
                    Silenciar en la app
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    Evita interrupciones visuales en primer plano mientras navegas
                    por la aplicación.
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.muteInApp}
                onValueChange={(val) => updateSettings({ muteInApp: val })}
                trackColor={{ false: "#374151", true: "#3b82f6" }}
                thumbColor="#ffffff"
                testID="toggle-mute-in-app"
              />
            </View>
          </View>

          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-4 mb-3">
            Alertas Sonoras
          </Text>

          {/* Toggle: Sound Enabled */}
          <View className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-8 h-8 rounded-lg bg-emerald-500/10 items-center justify-center mr-3">
                  <Feather name="volume-2" size={16} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">
                    Sonido de notificación
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    Reproduce un sonido cuando se recibe una notificación entrante.
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(val) => updateSettings({ soundEnabled: val })}
                trackColor={{ false: "#374151", true: "#10b981" }}
                thumbColor="#ffffff"
                testID="toggle-sound-enabled"
              />
            </View>
          </View>

          <View className="bg-gray-900/60 border border-gray-800/80 rounded-xl p-3.5 mt-2">
            <Text className="text-gray-400 text-xs leading-relaxed">
              💡 Todas las notificaciones que no se muestren en pantalla se
              guardarán automáticamente en tu{" "}
              <Text className="text-amber-400 font-semibold">
                Centro de Notificaciones
              </Text>{" "}
              para que nunca pierdas información importante.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
