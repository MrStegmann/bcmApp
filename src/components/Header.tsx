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
  const storeHeaderTitle = useMenuStore((state) => state.headerTitle);
  const headerAction = useMenuStore((state) => state.headerAction);
  const headerBackAction = useMenuStore((state) => state.headerBackAction);
  const displayTitle = title ?? storeHeaderTitle;

  // Reserve space for the device status bar using the measured top inset.
  // A minimum of 12px is always applied so the header breathes even on
  // devices that report 0 (e.g. older Android).
  const topPadding = Math.max(insets.top, 12);

  return (
    <View
      className="w-full z-20 relative"
      style={{ paddingTop: topPadding }}
      testID="header-safe-wrapper"
    >
      <View className="w-full flex-row justify-between items-center bg-danish-dark-gray border-b-2 border-danish-red shadow-xl shadow-red-900/50 px-4 py-3">
        {headerBackAction ? (
          <TouchableOpacity
            onPress={headerBackAction.onPress}
            className="w-10 h-10 items-center justify-center rounded-xl bg-gray-800/80 border border-gray-700/60 active:bg-gray-700"
            testID={headerBackAction.testID || "header-back-button"}
            accessibilityLabel={headerBackAction.label || "Volver"}
          >
            {headerBackAction.iconName ? (
              renderActionIcon(headerBackAction as HeaderAction)
            ) : (
              <Feather name="chevron-left" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}

        <Text
          className="flex-1 text-danish-white text-xl font-bold text-center tracking-wide"
          numberOfLines={1}
          testID="header-title"
        >
          {displayTitle}
        </Text>

        {headerAction ? (
          <TouchableOpacity
            onPress={headerAction.onPress}
            className="w-10 h-10 items-center justify-center rounded-xl bg-red-700/70 border border-red-600/60 active:bg-red-900"
            testID={headerAction.testID || "header-action-button"}
          >
            {headerAction.iconName
              ? renderActionIcon(headerAction)
              : <Text className="text-white text-lg font-bold">+</Text>}
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}

        {children ? (
          <View className="flex-row justify-center w-full gap-3 mt-2 px-4">
            {children}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
