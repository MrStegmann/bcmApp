import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import OffensivePlayer from "../assets/OffensivePlayer";
import DefensivePlayer from "../assets/DefensivePlayer";
import Ball from "../assets/Ball";
import Cone from "../assets/Cone";
import HandByHand from "../assets/HandByHand";
import { Ionicons } from "@expo/vector-icons";
import { ToolbarTool } from "../types";
import { toolbarStyles as styles } from "../css/styles";

const Toolbar = () => {
  const { 
    selectedTool, 
    setSelectedTool, 
    setSelectedObject,
    selectedObject,
    clearObjects,
    removeObject,
    boards,
    currentBoardIndex,
    createNextBoard,
    deleteCurrentBoard,
    goToBoard,
    setOptionsOpen,
    selectedLineId,
    removeLine
  } = usePlaygroundStore();

  const toggleTool = (tool: ToolbarTool) => {
    setSelectedTool(selectedTool === tool ? null : tool);
    setSelectedObject(null);
  };

  return (
    <View style={styles.toolbar}>
      <View style={styles.toolbarContent}>
        {/* Columna Extra Izquierda */}
        <View style={styles.leftmostColumn}>
          {/* Fila 1 */}
          <TouchableOpacity
            style={[styles.toolButton, (!selectedObject && !selectedLineId) && styles.toolButtonDisabled]}
            onPress={() => {
              if (selectedObject) {
                removeObject(selectedObject.id);
              } else if (selectedLineId) {
                removeLine(selectedLineId);
              }
            }}
            disabled={!selectedObject && !selectedLineId}
          >
            <Ionicons name="close-circle-outline" size={26} color="#EF4444" />
          </TouchableOpacity>

          {/* Fila 2 (Vacía) */}
          <View style={styles.toolButton} />
        </View>

        {/* Columna Central */}
        <View style={styles.centerColumn}>
          {/* Fila 1 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.OFFENSIVE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.OFFENSIVE)}
            >
              <OffensivePlayer label="1" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.BALL && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.BALL)}
            >
              <Ball />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.DRIBBLING_LINE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.DRIBBLING_LINE)}
            >
              <Ionicons name="pulse-outline" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.PASS_LINE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.PASS_LINE)}
            >
              <Ionicons name="paper-plane-outline" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.HAND_BY_HAND && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.HAND_BY_HAND)}
            >
              <HandByHand />
            </TouchableOpacity>
          </View>

          {/* Fila 2 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.DEFENSIVE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.DEFENSIVE)}
            >
              <DefensivePlayer label="X" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.CONE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.CONE)}
            >
              <Cone />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.MOVEMENT_LINE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.MOVEMENT_LINE)}
            >
              <Ionicons name="trending-up-outline" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton,
                selectedTool === ToolbarTool.SCREEN_LINE && styles.toolButtonActive,
              ]}
              onPress={() => toggleTool(ToolbarTool.SCREEN_LINE)}
            >
              <Ionicons name="shield-half-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Columna Escenas */}
        <View style={styles.scenesColumn}>
          {/* Fila 1: + y - */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => createNextBoard([])}
            >
              <Ionicons name="add" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolButton, boards.length <= 1 && styles.toolButtonDisabled]}
              onPress={deleteCurrentBoard}
              disabled={boards.length <= 1}
            >
              <Ionicons name="remove" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Fila 2: < y > */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.toolButton, currentBoardIndex === 0 && styles.toolButtonDisabled]}
              onPress={() => goToBoard(currentBoardIndex - 1)}
              disabled={currentBoardIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolButton, 
                (boards.length <= 1 || currentBoardIndex >= boards.length - 1) && styles.toolButtonDisabled
              ]}
              onPress={() => goToBoard(currentBoardIndex + 1)}
              disabled={boards.length <= 1 || currentBoardIndex >= boards.length - 1}
            >
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Columna Derecha */}
        <View style={styles.rightColumn}>
          {/* Fila 1 */}
          <TouchableOpacity
            style={styles.toolButton}
            onPress={clearObjects}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>

          {/* Fila 2 */}
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => setOptionsOpen(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export { Toolbar };
