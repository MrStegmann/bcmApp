import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useMenuStore, HeaderAction } from "../store/MenuStore";
import {
  NotificationCenterButton,
  NotificationCenterModal,
  NotificationSettingsModal,
} from "../features/notifications";

export interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const renderActionIcon = (action: HeaderAction) => {
  const color = "#ffffff";
  const size = 20;

  switch (action.iconFamily) {
    case "Entypo":
      return <Entypo name={action.iconName as any} size={size} color={color} />;
    case "MaterialIcons":
      return <MaterialIcons name={action.iconName as any} size={size} color={color} />;
    case "Foundation":
      return <Foundation name={action.iconName as any} size={size} color={color} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={action.iconName as any} size={size} color={color} />;
    case "FontAwesome5":
      return <FontAwesome5 name={action.iconName as any} size={size} color={color} />;
    case "Feather":
    default:
      return action.iconName
        ? <Feather name={action.iconName as any} size={size} color={color} />
        : null;
  }
};

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const insets = useSafeAreaInsets();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = React.useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = React.useState(false);
  const storeHeaderTitle = useMenuStore((state) => state.headerTitle);
  const headerAction = useMenuStore((state) => state.headerAction);
  const headerBackAction = useMenuStore((state) => state.headerBackAction);
  const headerCustomComponent = useMenuStore((state) => state.headerCustomComponent);
  const matchHeaderInfo = useMenuStore((state) => state.matchHeaderInfo);
  const displayTitle = title ?? storeHeaderTitle;

  // Reserve space for the device status bar using the measured top inset.
  // A minimum of 12px is always applied so the header breathes even on
  // devices that report 0 (e.g. older Android).
  const topPadding = Math.max(insets.top, 12);

  return (
    <View
      className="w-full z-20 relative bg-surface-container"
      style={{ paddingTop: topPadding }}
      testID="header-safe-wrapper"
    >
      <View className="w-full flex-row justify-between items-center bg-surface-container border-b border-slate-border shadow-xl px-3 py-2.5">
        {headerBackAction ? (
          <TouchableOpacity
            onPress={headerBackAction.onPress}
            className="w-10 h-10 items-center justify-center rounded-xl bg-slate-card border border-slate-border active:bg-slate-dark"
            testID={headerBackAction.testID || "header-back-button"}
            accessibilityLabel={headerBackAction.label || "Volver"}
          >
            {headerBackAction.iconName ? (
              renderActionIcon(headerBackAction as HeaderAction)
            ) : (
              <Feather name="arrow-left" size={22} color="#ffffff" />
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}

        {matchHeaderInfo ? (
          <View
            className="flex-1 items-center justify-center px-1"
            testID="global-match-score-header"
          >
            {matchHeaderInfo.scoreOnly ? (
              <View className="flex-row items-center justify-center">
                <Text
                  className="text-court-orange font-black text-2xl font-mono tracking-wider"
                  testID="header-score-local"
                >
                  {matchHeaderInfo.teamScore}
                </Text>
                <Text className="text-slate-400 font-black text-xl mx-2 font-mono">-</Text>
                <Text
                  className="text-tactical-blue-light font-black text-2xl font-mono tracking-wider"
                  testID="header-score-rival"
                >
                  {matchHeaderInfo.rivalScore}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center justify-center w-full">
                {/* Local Team: Wraps without truncation, right-aligned next to score */}
                <View className="flex-1 items-end pr-1.5 justify-center">
                  <Text
                    className="text-court-orange font-extrabold text-xs text-right leading-tight"
                    testID="header-local-team-name"
                  >
                    {matchHeaderInfo.teamName}
                  </Text>
                </View>

                {/* Center Score Badge */}
                <View className="flex-row items-center bg-slate-dark px-2.5 py-1 rounded-lg border border-slate-border">
                  <Text className="text-white font-black text-sm">{matchHeaderInfo.teamScore}</Text>
                  <Text className="text-slate-400 font-black text-xs mx-1">-</Text>
                  <Text className="text-tactical-blue-light font-black text-sm">{matchHeaderInfo.rivalScore}</Text>
                </View>

                {/* Rival Team: Wraps without truncation, left-aligned next to score */}
                <View className="flex-1 items-start pl-1.5 justify-center">
                  <Text
                    className="text-tactical-blue font-extrabold text-xs text-left leading-tight"
                    testID="header-rival-team-name"
                  >
                    {matchHeaderInfo.rivalName}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : headerCustomComponent ? (
          <View className="flex-1 items-center justify-center px-1" testID="header-custom-content">
            {headerCustomComponent}
          </View>
        ) : (
          <Text
            className="flex-1 text-white text-xl font-bold text-center tracking-wide"
            numberOfLines={1}
            testID="header-title"
          >
            {displayTitle}
          </Text>
        )}

        <View className="flex-row items-center gap-2">
          <NotificationCenterButton
            onPress={() => setIsNotificationCenterOpen(true)}
            testID="header-notification-center-button"
          />

          {headerAction ? (
            <TouchableOpacity
              onPress={headerAction.onPress}
              className="w-10 h-10 items-center justify-center rounded-xl bg-court-orange border border-court-orange-dark active:bg-court-orange-dark shadow-md"
              testID={headerAction.testID || "header-action-button"}
              accessibilityLabel={headerAction.label || "Acción"}
            >
              {headerAction.iconName ? (
                renderActionIcon(headerAction)
              ) : (
                <Text className="text-white text-lg font-bold">+</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>

        {children ? (
          <View className="flex-row justify-center w-full gap-3 mt-2 px-4">
            {children}
          </View>
        ) : null}
      </View>

      <NotificationCenterModal
        visible={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onOpenSettings={() => {
          setIsNotificationSettingsOpen(true);
        }}
      />
      <NotificationSettingsModal
        visible={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
    </View>
  );
};

export default Header;
