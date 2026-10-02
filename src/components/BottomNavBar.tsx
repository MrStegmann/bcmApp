import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useMenuStore } from "../store/MenuStore";
import { BottomMenuItem } from "../store/MenuStore";
import { TopMenuEnums } from "../types/enums";

export interface BottomNavBarProps {
  items?: BottomMenuItem[];
  activeTab?: TopMenuEnums;
}

const renderIcon = (item: BottomMenuItem, isActive: boolean) => {
  const color = isActive ? "#ef4444" : "#9ca3af";
  const size = 22;

  switch (item.iconFamily) {
    case "Entypo":
      return <Entypo name={item.iconName as any} size={size} color={color} />;
    case "MaterialIcons":
      return <MaterialIcons name={item.iconName as any} size={size} color={color} />;
    case "Foundation":
      return <Foundation name={item.iconName as any} size={size} color={color} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={item.iconName as any} size={size} color={color} />;
    case "FontAwesome5":
      return <FontAwesome5 name={item.iconName as any} size={size} color={color} />;
    case "Feather":
    default:
      return <Feather name={item.iconName as any} size={size} color={color} />;
  }
};

export default function BottomNavBar({ items, activeTab }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const storeItems = useMenuStore((state) => state.bottomMenuItems);
  const storeActiveTab = useMenuStore((state) => state.activeTab);

  const menuItems = items ?? storeItems;
  const currentTab = activeTab ?? storeActiveTab;

  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  // Reserve space for the device home-gesture bar using the measured bottom inset.
  // A minimum of 8px is always applied so the navbar breathes even on
  // devices that report 0 (e.g. older Android).
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View
      className="w-full bg-danish-dark-gray border-t-2 border-danish-red shadow-2xl z-40 px-2 pt-2"
      style={{ paddingBottom: bottomPadding }}
      testID="bottom-navbar-safe-wrapper"
    >
      <View className="flex-row justify-around items-center w-full">
        {menuItems.map((item) => {
          const isActive = item.id === currentTab;

          return (
            <TouchableOpacity
              key={String(item.id)}
              onPress={item.onPress}
              accessibilityLabel={item.label}
              className={`flex-1 items-center justify-center py-2.5 px-1 rounded-xl mx-0.5 active:bg-gray-800 ${
                isActive ? "bg-red-950/40 border border-red-900/60" : ""
              }`}
              testID={item.testID || `bottom-nav-item-${item.id}`}
            >
              {renderIcon(item, isActive)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
