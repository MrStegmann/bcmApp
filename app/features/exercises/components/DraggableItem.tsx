import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import OffensivePlayer from "../assets/OffensivePlayer";
import DefensivePlayer from "../assets/DefensivePlayer";
import Ball from "../assets/Ball";
import Cone from "../assets/Cone";
import HandByHand from "../assets/HandByHand";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import { Object as BoardObject, ToolbarTool } from "../types";

interface Props {
  item: BoardObject;
}

const DraggableItem = ({ item }: Props) => {
  const updateObjectPosition = usePlaygroundStore((state) => state.updateObjectPosition);
  const updateObjectRotation = usePlaygroundStore((state) => state.updateObjectRotation);
  const selectedObject = usePlaygroundStore((state) => state.selectedObject);
  const setSelectedObject = usePlaygroundStore((state) => state.setSelectedObject);

  const handleSelect = () => {
    setSelectedObject(item);
  };

  const translateX = useSharedValue(item.x || 0);
  const translateY = useSharedValue(item.y || 0);
  const startX = useSharedValue(item.x || 0);
  const startY = useSharedValue(item.y || 0);

  const rotation = useSharedValue(item.rotation || 0);
  const startRotation = useSharedValue(0);

  const startVecX = useSharedValue(0);
  const startVecY = useSharedValue(0);
  const R = 37.5; // Distancia desde el centro del jugador hasta el centro de la flecha

  const scale = usePlaygroundStore((state) => state.scale);

  useEffect(() => {
    if (item.rotation !== undefined) {
      rotation.value = item.rotation;
    }
  }, [item.rotation]);

  const tapGesture = Gesture.Tap().runOnJS(true).onEnd(() => {
    handleSelect();
  });

  const panGesture = Gesture.Pan().runOnJS(true)
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
      handleSelect();
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX / scale;
      translateY.value = startY.value + event.translationY / scale;
    })
    .onEnd(() => {
      updateObjectPosition(item.id, translateX.value, translateY.value);
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, panGesture);

  const rotationGesture = Gesture.Pan()
    .onStart(() => {
      startVecX.value = R * Math.sin(rotation.value);
      startVecY.value = -R * Math.cos(rotation.value);
    })
    .onUpdate((event) => {
      const currentX = startVecX.value + event.translationX / scale;
      const currentY = startVecY.value + event.translationY / scale;
      rotation.value = Math.atan2(currentY, currentX) + Math.PI / 2;
    })
    .onEnd(() => {
      runOnJS(updateObjectRotation)(item.id, rotation.value);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ] as any,
    };
  });

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}rad` }],
    };
  });

  const isSelected = selectedObject?.id === item.id;

  return (
    <Animated.View style={[{ position: "absolute", left: 0, top: 0 }, animatedStyle]}>

      {/* Capa 1: Gráficos y Flecha de Rotación (Rotan) */}
      <Animated.View
        style={[
          {
            width: 35,
            height: 35,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: isSelected ? "#EF4444" : "transparent",
            borderRadius: 17,
          },
          rotationStyle,
        ]}
      >
        {/* Usamos label="" para que los SVG no dibujen su propio texto, lo dibujaremos nosotros recto */}
        {item.type === ToolbarTool.OFFENSIVE && <OffensivePlayer label="" />}
        {item.type === ToolbarTool.DEFENSIVE && <DefensivePlayer label="" />}
        {item.type === ToolbarTool.BALL && <Ball />}
        {item.type === ToolbarTool.CONE && <Cone />}
        {item.type === ToolbarTool.HAND_BY_HAND && <HandByHand />}

        {/* Flecha de Rotación */}
        {isSelected && item.type === ToolbarTool.DEFENSIVE && (
          <GestureDetector gesture={rotationGesture}>
            <View
              style={{
                position: "absolute",
                top: -35,
                left: 2.5,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 15,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
                elevation: 3,
              }}
            >
              <Ionicons name="arrow-up" size={20} color="#EF4444" />
            </View>
          </GestureDetector>
        )}
      </Animated.View>

      {/* Capa 2: Texto (Siempre recto) */}
      {(item.type === ToolbarTool.OFFENSIVE || item.type === ToolbarTool.DEFENSIVE) && (
        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]} pointerEvents="none">
          <Text style={{ fontWeight: "bold", fontSize: 13, color: item.type === ToolbarTool.OFFENSIVE ? "#3582db" : "red" }}>
            {item.label || "1"}
          </Text>
        </View>
      )}

      {/* Capa 3: Receptor de gestos principales (Pan y Tap) */}
      <GestureDetector gesture={composedGesture}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "transparent" }]} />
      </GestureDetector>

    </Animated.View>
  );
};

export default DraggableItem;
