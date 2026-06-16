import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import Svg, { Polyline } from "react-native-svg";
import FullCourt from "../assets/FullCourt";
import { usePlaygroundStore } from "../store/usePlaygroundStore";
import DraggableItem from "./DraggableItem";
import { simplifyPath, createWavyPath, Point } from "../utils/geometry";
import { LineEditor } from "./LineEditor";
import { Line, ToolbarTool } from "../types";
import { calculateNextSceneObjects } from "../utils/movementLogic";
import { playgroundStyles as styles } from "../css/styles";

export const getCenteredPosition = (
  x: number,
  y: number,
  width: number,
  height: number,
) => ({
  x: x - width / 2,
  y: y - height / 2,
});

const VIRTUAL_WIDTH = 384;
const VIRTUAL_HEIGHT = 540;

const Playground = () => {
  const { objects, addObject, selectedTool, setSelectedObject, lines, addLine, selectedLineId, setSelectedLineId, updateLinePoints, scale, setScale, boards, currentBoardIndex, goToBoard, createNextBoard } = usePlaygroundStore();
  const [currentLinePoints, setCurrentLinePoints] = useState<Point[]>([]);
  const linePointsRef = useRef<Point[]>([]);
  const lastSelectTime = useRef<number>(0);

  const handleLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    const scaleX = width / VIRTUAL_WIDTH;
    const scaleY = height / VIRTUAL_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  };

  const handleDrawStart = (x: number, y: number) => {
    linePointsRef.current = [{ x, y }];
    setCurrentLinePoints(linePointsRef.current);
  };

  const handleDrawUpdate = (x: number, y: number) => {
    linePointsRef.current.push({ x, y });
    setCurrentLinePoints([...linePointsRef.current]);
  };

  const finalizeLine = () => {
    const points = linePointsRef.current;
    if (points.length > 1) {
      let finalPoints = simplifyPath(points, 10);

      if (selectedTool === ToolbarTool.PASS_LINE) {
        finalPoints = [points[0], points[points.length - 1]];
      }

      const indexedPoints = finalPoints.map((p, index) => ({ index, x: p.x, y: p.y }));

      addLine({
        id: Date.now().toString(),
        type: selectedTool as string,
        color: "black",
        width: 2,
        startX: indexedPoints[0].x,
        startY: indexedPoints[0].y,
        endX: indexedPoints[indexedPoints.length - 1].x,
        endY: indexedPoints[indexedPoints.length - 1].y,
        points: indexedPoints,
      });
    }
    linePointsRef.current = [];
    setCurrentLinePoints([]);
  };

  const tapGesture = Gesture.Tap()
    .enabled(selectedTool !== ToolbarTool.MOVEMENT_LINE && selectedTool !== ToolbarTool.DRIBBLING_LINE && selectedTool !== ToolbarTool.PASS_LINE && selectedTool !== ToolbarTool.SCREEN_LINE)
    .onEnd((e) => {
      if (selectedTool) {
        const { x, y } = getCenteredPosition(e.x, e.y, 36, 36);

        let label: string | undefined;
        if (selectedTool === ToolbarTool.OFFENSIVE) {
          const currentCount = objects.filter((o) => o.type === ToolbarTool.OFFENSIVE).length;
          label = (currentCount + 1).toString();
        } else if (selectedTool === ToolbarTool.DEFENSIVE) {
          const currentCount = objects.filter((o) => o.type === ToolbarTool.DEFENSIVE).length;
          label = (currentCount + 1).toString();
        }

        runOnJS(addObject)({
          id: Date.now().toString(),
          type: selectedTool,
          x,
          y,
          width: 36,
          height: 36,
          ...(label && { label }),
        });
      } else {
        runOnJS(() => {
          const state = usePlaygroundStore.getState();
          if (Date.now() - state.lastSelectTime > 100) {
            state.setSelectedObject(null);
            state.setSelectedLineId(null);
          }
        })();
      }
    });

  const drawGesture = Gesture.Pan()
    .enabled(selectedTool === ToolbarTool.MOVEMENT_LINE || selectedTool === ToolbarTool.DRIBBLING_LINE || selectedTool === ToolbarTool.PASS_LINE || selectedTool === ToolbarTool.SCREEN_LINE)
    .onStart((e) => {
      runOnJS(handleDrawStart)(e.x, e.y);
    })
    .onUpdate((e) => {
      runOnJS(handleDrawUpdate)(e.x, e.y);
    })
    .onEnd(() => {
      runOnJS(finalizeLine)();
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, drawGesture);

  const RenderLinePath = ({ line }: { line: Line }) => {
    let pointsToRender: { x: number; y: number }[] = line.points;
    if (line.type === "dribbling_line") {
      pointsToRender = createWavyPath(line.points, 5, 15);
    }

    if (pointsToRender.length < 2) return null;
    const pointsStr = pointsToRender.map((p) => `${p.x},${p.y}`).join(" ");

    // Flecha o Bloqueo
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

    // Drag state local para evitar re-renderizados completos en cada movimiento
    const dragStart = React.useRef({ x: 0, y: 0 });

    return (
      <React.Fragment>
        {/* Camino invisible más grueso para detectar el tacto/arrastre */}
        <Polyline
          points={pointsStr}
          stroke="transparent"
          strokeWidth="30"
          fill="none"
          onPress={() => setSelectedLineId(line.id)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            setSelectedLineId(line.id);
            dragStart.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
          }}
          onResponderMove={(e) => {
            const dx = (e.nativeEvent.pageX - dragStart.current.x) / scale;
            const dy = (e.nativeEvent.pageY - dragStart.current.y) / scale;
            dragStart.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };

            const newPoints = line.points.map((p, index) => ({ index, x: p.x + dx, y: p.y + dy }));
            updateLinePoints(line.id, newPoints);
          }}
        />
        {/* Camino visible */}
        <Polyline
          points={pointsStr}
          stroke={selectedLineId === line.id ? "#3B82F6" : "black"}
          strokeWidth="3"
          fill="none"
          strokeDasharray={line.type === "pass_line" ? "10, 10" : undefined}
          pointerEvents="none"
        />
        <Polyline points={endDecoratorStr} stroke={selectedLineId === line.id ? "#3B82F6" : "black"} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
      </React.Fragment>
    );
  };

  const renderCurrentLine = () => {
    if (currentLinePoints.length < 2) return null;
    let pointsToRender = currentLinePoints;
    if (selectedTool === ToolbarTool.PASS_LINE) {
      pointsToRender = [currentLinePoints[0], currentLinePoints[currentLinePoints.length - 1]];
    }
    const pointsStr = pointsToRender.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <Polyline
        points={pointsStr}
        stroke="black"
        strokeWidth="3"
        fill="none"
        strokeDasharray={selectedTool === ToolbarTool.PASS_LINE ? "10, 10" : undefined}
        pointerEvents="none"
      />
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.courtContainer} onLayout={handleLayout}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={{
              width: VIRTUAL_WIDTH,
              height: VIRTUAL_HEIGHT,
              transform: [
                { translateY: -VIRTUAL_HEIGHT * (1 - scale) / 2 },
                { scale }
              ]
            }}>
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <FullCourt />
              </View>

              <Svg style={StyleSheet.absoluteFill} pointerEvents="box-none" width="100%" height="100%">
                {lines.map((line) => <RenderLinePath key={line.id} line={line} />)}
                {renderCurrentLine()}
              </Svg>

              <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                {objects.map((obj) => (
                  <DraggableItem key={obj.id} item={obj} />
                ))}
                {selectedLineId && lines.find(l => l.id === selectedLineId) && (
                  <LineEditor line={lines.find(l => l.id === selectedLineId)!} />
                )}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export { Playground };
