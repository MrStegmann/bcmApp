import React from "react";
import { View, Text } from "react-native";
import { useMenuStore } from "../store/MenuStore";

export interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const storeHeaderTitle = useMenuStore((state) => state.headerTitle);
  const displayTitle = title ?? storeHeaderTitle;

  return (
    <View className="w-full z-20 relative">
      <View className="w-full h-24 flex justify-center items-center rounded-b-3xl bg-danish-dark-gray border-b-2 border-danish-red shadow-xl shadow-red-900/50 px-4 pt-4">
        <Text
          className="text-danish-white text-xl font-bold text-center tracking-wide"
          numberOfLines={1}
          testID="header-title"
        >
          {displayTitle}
        </Text>

        {children ? (
          <View className="flex-row justify-center w-full gap-3 mt-2">
            {children}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
