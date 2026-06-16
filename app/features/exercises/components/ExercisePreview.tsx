import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { CoachBoard, Exercise, Line, Object as BoardObject } from "../types";
import FullCourt from "../assets/FullCourt";
import { createWavyPath } from "../utils/geometry";
import OffensivePlayer from "../assets/OffensivePlayer";
import DefensivePlayer from "../assets/DefensivePlayer";
import Ball from "../assets/Ball";
import Cone from "../assets/Cone";
import HandByHand from "../assets/HandByHand";

const VIRTUAL_WIDTH = 384;
const VIRTUAL_HEIGHT = 540;

const RenderLinePath = ({ line }: { line: Line }) => {
  let pointsToRender: { x: number; y: number }[] = line.points;
  if (line.type === "dribbling_line") {
    pointsToRender = createWavyPath(line.points, 5, 15);
  }

  if (pointsToRender.length < 2) return null;
  const pointsStr = pointsToRender.map((p) => `${p.x},${p.y}`).join(" ");

  const p1 = pointsToRender[pointsToRender.length - 2];
  const p2 = pointsToRender[pointsToRender.length - 1];
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

  let endDecoratorStr = "";

  if (line.type === "screen_line") {
    const screenLength = 15;
    const screenP1 = {
      x: p2.x + screenLength * Math.cos(angle + Math.PI / 2),
      y: p2.y + screenLength * Math.sin(angle + Math.PI / 2),
    };
    const screenP2 = {
      x: p2.x + screenLength * Math.cos(angle - Math.PI / 2),
      y: p2.y + screenLength * Math.sin(angle - Math.PI / 2),
    };
    endDecoratorStr = `${screenP1.x},${screenP1.y} ${screenP2.x},${screenP2.y}`;
  } else {
    const arrowLength = 15;
    const arrowAngle1 = angle + Math.PI / 6;
    const arrowAngle2 = angle - Math.PI / 6;

    const arrowP1 = {
      x: p2.x - arrowLength * Math.cos(arrowAngle1),
      y: p2.y - arrowLength * Math.sin(arrowAngle1),
    };
    const arrowP2 = {
      x: p2.x - arrowLength * Math.cos(arrowAngle2),
      y: p2.y - arrowLength * Math.sin(arrowAngle2),
    };
    endDecoratorStr = `${arrowP1.x},${arrowP1.y} ${p2.x},${p2.y} ${arrowP2.x},${arrowP2.y}`;
  }

  return (
    <React.Fragment>
      <Polyline
        points={pointsStr}
        stroke="black"
        strokeWidth="3"
        fill="none"
        strokeDasharray={line.type === "pass_line" ? "10, 10" : undefined}
      />
      <Polyline
        points={endDecoratorStr}
        stroke="black"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </React.Fragment>
  );
};

const RenderStaticObject = ({ item }: { item: BoardObject }) => {
  const rotation = item.rotation || 0;
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: [
          { translateX: item.x },
          { translateY: item.y }
        ],
      }}
    >
      <View
        style={{
          width: 35,
          height: 35,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: `${rotation}rad` }],
        }}
      >
        {item.type === "offensive" && <OffensivePlayer label="" />}
        {item.type === "defensive" && <DefensivePlayer label="" />}
        {item.type === "ball" && <Ball />}
        {item.type === "cone" && <Cone />}
        {item.type === "handbyhand" && <HandByHand />}
      </View>
      {(item.type === "offensive" || item.type === "defensive") && (
        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ fontWeight: "bold", fontSize: 13, color: item.type === "offensive" ? "#3582db" : "red" }}>
            {item.label || "1"}
          </Text>
        </View>
      )}
    </View>
  );
};

interface Props {
  exercise: Exercise;
  board?: CoachBoard;
  containerWidth?: number;
  containerHeight?: number;
}

export const ExercisePreview = ({ exercise, board, containerWidth = 150, containerHeight = 90 }: Props) => {
  const activeBoard = board || (exercise.coachBoard && exercise.coachBoard.length > 0 ? exercise.coachBoard[0] : null);

  if (!activeBoard) {
    return (
      <View className="items-center bg-gray-100 border-gray-200 rounded-lg border justify-center" style={{ width: containerWidth, height: containerHeight }}>
        <Text className="text-gray-500 text-xs font-semibold">Sin escena</Text>
      </View>
    );
  }

  const scaleX = containerWidth / VIRTUAL_WIDTH;
  const scaleY = containerHeight / VIRTUAL_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  return (
    <View className="bg-gray-100 rounded-lg overflow-hidden" style={{ width: containerWidth, height: containerHeight }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: VIRTUAL_WIDTH,
            height: VIRTUAL_HEIGHT,
            transform: [{ scale }],
            backgroundColor: "#fff", // Opcional, para simular la cancha
            overflow: "hidden"
          }}
        >
          <View style={StyleSheet.absoluteFill}>
            <FullCourt />
          </View>

          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            {activeBoard.lines?.map((line) => <RenderLinePath key={line.id} line={line} />)}
          </Svg>

          <View style={StyleSheet.absoluteFill}>
            {activeBoard.objects?.map((obj) => (
              <RenderStaticObject key={obj.id} item={obj} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

