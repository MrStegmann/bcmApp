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
      <SafeAreaView className="flex-1 bg-canvas">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-slate-border bg-surface-container">
          <View className="flex-row items-center">
            <Feather name="settings" size={20} color="#F97316" />
            <Text className="text-white text-lg font-bold ml-2">
              Ajustes de Notificaciones
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 items-center justify-center rounded-lg bg-surface-elevated"
            testID="notification-settings-close-btn"
            accessibilityLabel="Cerrar ajustes"
          >
            <Feather name="x" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Supresión de Ventanas Emergentes
          </Text>

          {/* Toggle: Mute in Match */}
          <View className="bg-surface-container border border-slate-border rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-8 h-8 rounded-lg bg-court-orange/15 items-center justify-center mr-3">
                  <Feather name="shield" size={16} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">
                    Silenciar en partidos
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    Evita ventanas emergentes durante partidos activos para no
                    obstruir controles ni juego.
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.muteInMatch}
                onValueChange={(val) => updateSettings({ muteInMatch: val })}
                trackColor={{ false: "#334155", true: "#F97316" }}
                thumbColor="#ffffff"
                testID="toggle-mute-in-match"
              />
            </View>
          </View>

          {/* Toggle: Mute in App */}
          <View className="bg-surface-container border border-slate-border rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-8 h-8 rounded-lg bg-tactical-blue/15 items-center justify-center mr-3">
                  <Feather name="smartphone" size={16} color="#0EA5E9" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">
                    Silenciar en la app
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    Evita interrupciones visuales en primer plano mientras navegas
                    por la aplicación.
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.muteInApp}
                onValueChange={(val) => updateSettings({ muteInApp: val })}
                trackColor={{ false: "#334155", true: "#0EA5E9" }}
                thumbColor="#ffffff"
                testID="toggle-mute-in-app"
              />
            </View>
          </View>

          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-4 mb-3">
            Alertas Sonoras
          </Text>

          {/* Toggle: Sound Enabled */}
          <View className="bg-surface-container border border-slate-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-8 h-8 rounded-lg bg-emerald-500/15 items-center justify-center mr-3">
                  <Feather name="volume-2" size={16} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">
                    Sonido de notificación
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    Reproduce un sonido cuando se recibe una notificación entrante.
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(val) => updateSettings({ soundEnabled: val })}
                trackColor={{ false: "#334155", true: "#10B981" }}
                thumbColor="#ffffff"
                testID="toggle-sound-enabled"
              />
            </View>
          </View>

          <View className="bg-surface-elevated/60 border border-slate-border rounded-xl p-3.5 mt-2">
            <Text className="text-slate-400 text-xs leading-relaxed">
              💡 Todas las notificaciones que no se muestren en pantalla se
              guardarán automáticamente en tu{" "}
              <Text className="text-court-orange font-semibold">
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
