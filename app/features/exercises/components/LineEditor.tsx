import React from "react";
import { View, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from "react-native-reanimated";
import { Line } from "../types";
import { usePlaygroundStore } from "../store/usePlaygroundStore";

const VertexHandle = ({ point, index, lineId }: { point: { x: number, y: number }, index: number, lineId: string }) => {
  const { updateLinePoints, removeLine } = usePlaygroundStore();
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const scale = usePlaygroundStore((state) => state.scale);

  const pan = Gesture.Pan().runOnJS(true)
    .onStart(() => {
      const state = usePlaygroundStore.getState();
      const line = state.lines.find(l => l.id === lineId);
      if (line) {
        startX.value = line.points[index].x;
        startY.value = line.points[index].y;
      }
    })
    .onUpdate((e) => {
      const sx = startX.value;
      const sy = startY.value;
      const dx = e.translationX / scale;
      const dy = e.translationY / scale;
      const state = usePlaygroundStore.getState();
      const line = state.lines.find(l => l.id === lineId);
      if (line) {
        const newPoints = [...line.points];
        newPoints[index] = { index, x: sx + dx, y: sy + dy };
        updateLinePoints(lineId, newPoints);
      }
    });

  const longPress = Gesture.LongPress().runOnJS(true)
    .minDuration(500)
    .onStart(() => {
      const state = usePlaygroundStore.getState();
      const line = state.lines.find(l => l.id === lineId);
      if (line) {
        if (line.points.length <= 2) {
          removeLine(lineId);
        } else {
          const newPoints = line.points
            .filter((_, i) => i !== index)
            .map((p, i) => ({ ...p, index: i }));
          updateLinePoints(lineId, newPoints);
        }
      }
    });

  const gesture = Gesture.Simultaneous(pan, longPress);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={{
        position: "absolute",
        left: point.x - 10,
        top: point.y - 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#3B82F6",
        borderWidth: 2,
        borderColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5
      }} />
    </GestureDetector>
  );
};

export const LineEditor = ({ line }: { line: Line }) => {
  if (!line || !line.points) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {line.points.map((pt, index) => (
        <VertexHandle key={index} point={pt} index={index} lineId={line.id} />
      ))}
    </View>
  );
};
