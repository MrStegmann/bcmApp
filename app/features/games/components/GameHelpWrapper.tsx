import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HELP_DATA } from "../hooks/useGamePlayMatch";

interface HelpWrapperProps {
  children: React.ReactNode;
  helpKey: keyof typeof HELP_DATA;
  isHelpModeActive: boolean;
  setActiveHelpItem: (item: { title: string; description: string } | null) => void;
  style?: any;
}

export const HelpWrapper = ({ children, helpKey, isHelpModeActive, setActiveHelpItem, style }: HelpWrapperProps) => (
  <View style={[{ position: "relative" }, style]}>
    {children}
    {isHelpModeActive && (
      <Pressable
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderRadius: 8,
          justifyContent: "center", alignItems: "center", zIndex: 100
        }}
        onPress={() => setActiveHelpItem(HELP_DATA[helpKey])}
      >
        <Ionicons name="information-circle" size={32} color="#3B82F6" />
      </Pressable>
    )}
  </View>
);
