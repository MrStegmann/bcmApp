import React from "react";
import { View, Text, Pressable, DimensionValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gamePlayMatchStyles as styles } from "../css/styles";
import HalfCourt from "../../exercises/assets/HalfCourt";
import { HelpWrapper } from "./GameHelpWrapper";
import { Player } from "../../players/types";

const COURT_POSITIONS: { x: DimensionValue; y: DimensionValue }[] = [
  { x: "50%", y: "85%" }, // Base (top center of 3pt)
  { x: "86%", y: "56%" }, // Escolta (right wing)
  { x: "14%", y: "56%" }, // Alero (left wing)
  { x: "88%", y: "20%" }, // Ala-pívot (right corner)
  { x: "12%", y: "20%" }, // Pívot (left corner)
];

interface GameCourtProps {
  courtPlayers: Player[];
  isSubMode: boolean;
  subsOut: Set<string>;
  selectedPlayerId: string | null;
  handlePlayerTap: (playerId: string, isBench: boolean) => void;
  isHelpModeActive: boolean;
  setActiveHelpItem: (item: any) => void;
}

export const GameCourt = ({
  courtPlayers, isSubMode, subsOut, selectedPlayerId, handlePlayerTap,
  isHelpModeActive, setActiveHelpItem
}: GameCourtProps) => {
  return (
    <HelpWrapper helpKey="court_player" isHelpModeActive={isHelpModeActive} setActiveHelpItem={setActiveHelpItem} style={{ flex: 1 }}>
      <View style={styles.courtContainer}>
        <View style={{ width: "100%", aspectRatio: 384 / 300, position: "absolute", top: 0 }}>
          <HalfCourt />
          {courtPlayers.map((p, index) => {
            const pos = COURT_POSITIONS[index] || { x: "50%", y: "50%" };
            const isSelected = isSubMode ? subsOut.has(p.id) : selectedPlayerId === p.id;
            return (
              <Pressable
                key={p.id}
                style={[styles.playerToken, { left: pos.x, top: pos.y, transform: [{ translateX: -25 }, { translateY: -25 }] }]}
                onPress={() => handlePlayerTap(p.id, false)}
              >
                <Ionicons name="shirt" size={48} color={isSelected ? "#2563EB" : "#1F2937"} />
                <Text style={styles.playerTokenText}>{p.jerseyNumber}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </HelpWrapper>
  );
};
