import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HelpInfoModalProps {
  activeHelpItem: { title: string; description: string } | null;
  setActiveHelpItem: (item: any) => void;
}

export const HelpInfoModal = ({
  activeHelpItem, setActiveHelpItem
}: HelpInfoModalProps) => {
  return (
    <Modal visible={!!activeHelpItem} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 24 }}>
        <View style={{ backgroundColor: "#1F2937", borderRadius: 16, padding: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 }}>
            <Ionicons name="information-circle" size={28} color="#3B82F6" />
            <Text style={{ color: "#F9FAFB", fontSize: 20, fontWeight: "bold" }}>{activeHelpItem?.title}</Text>
          </View>
          <Text style={{ color: "#D1D5DB", fontSize: 16, lineHeight: 24, marginBottom: 24 }}>{activeHelpItem?.description}</Text>
          <Pressable style={{ backgroundColor: "#2563EB", padding: 14, borderRadius: 8, alignItems: "center" }} onPress={() => setActiveHelpItem(null)}>
            <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
