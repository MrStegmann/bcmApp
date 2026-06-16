import React, { useEffect, useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigationStore as useNavigator } from "../hooks/useNavigationStore";
import { useAppNavigation } from "../hooks/useAppNavigation";

const UserNavigation = () => {
  const { navigate } = useAppNavigation();

  const navigationItems = useNavigator((state) => state.navigationItems);
  const isNavVisible = useNavigator((state) => state.isNavVisible);

  if (!isNavVisible) return null;

  return (
    <View className="h-14 w-full flex-row items-center justify-between bg-gray-200 px-5">
      <View className="flex-row flex-1 gap-4">
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            className="w-10 h-10"
            onPress={() => navigate(item.path)}
          >
            <View className="w-full h-full flex items-center justify-center z-10">
              {item.icon ? <>{item.icon}</> : <Text>{item.label}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export { UserNavigation };
