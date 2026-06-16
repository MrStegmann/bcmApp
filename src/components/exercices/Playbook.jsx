import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native-web";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import HalfCourt from "./assests/HalfCourt";
import FullCourt from "./assests/FullCourt";
import { usePlaybookStore } from "../../store/PlaybookStore";
import LinesLayer from "./LinesLayer";
import TokenEnums from "../../Enums/TokenEnums";
import DraggableItems from "./DraggableItems";
import DraggablePlayer from "./DraggablePlayer";
import Svg, { Path } from "react-native-svg";
import getDistance from "../../helpers/getDistance";
import getSvgOffset from "../../helpers/getSvgOffset";

const VB_WIDTH = 384;
const VB_HEIGHT = 540;

const PLAYER_TOOLS = [TokenEnums.OFFENSIVE, TokenEnums.DEFENSIVE];
const ITEM_TOOLS = [TokenEnums.BALL, TokenEnums.CONE, TokenEnums.HAND_BY_HAND];
const LINE_TOOLS = [
  TokenEnums.MOVEMENT_LINE,
  TokenEnums.PASS_LINE,
  TokenEnums.BLOCK_LINE,
  TokenEnums.DRIBBLING_LINE,
];

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Playbook = ({
  players,
  items,
  lines,
  setPlayers,
  setItems,
  setLines,
}) => {
  const currentPoints = useSharedValue([]);
  const activeTool = usePlaybookStore((state) => state.activeTool);
  const setSelectedObject = usePlaybookStore(
    (state) => state.setSelectedObject,
  );
  const selectedObject = usePlaybookStore((state) => state.selectedObject);
  const setActiveTool = usePlaybookStore((state) => state.setActiveTool);

  const halfCourt = usePlaybookStore((state) => state.halfCourt);

  const [layout, setLayout] = React.useState({ width: 1, height: 1 });

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const dragStartY = useSharedValue(0);

  const principalGesture = Gesture.Tap()
    .maxDuration(250)
    .runOnJS(true)
    .onStart((e) => {
      setSelectedObject(null);
      if (activeTool === TokenEnums.SELECT_OBJECT) {
        handleSelection(e.x, e.y);
        return;
      }

      const { offsetX, offsetY, scale } = getSvgOffset(
        layout,
        VB_WIDTH,
        VB_HEIGHT,
        halfCourt,
      );

      const svgX = (e.x - offsetX) / scale;
      const svgY = (e.y - offsetY) / scale;

      const id = Date.now().toString();

      if (PLAYER_TOOLS.includes(activeTool)) {
        setPlayers((prev) => [
          ...prev,
          {
            id,
            type: activeTool,
            x: svgX,
            y: svgY,
            label: `${prev.filter((p) => p.type === activeTool).length + 1}`,
          },
        ]);
        return;
      }

      if (ITEM_TOOLS.includes(activeTool)) {
        setItems((prev) => [
          ...prev,
          {
            id,
            type: activeTool,
            x: svgX,
            y: svgY,
          },
        ]);
        return;
      }

      if (LINE_TOOLS.includes(activeTool)) {
        if (currentPoints.value.length < 2) {
          currentPoints.value = [];
          return;
        }

        setLines((prev) => [
          ...prev,
          {
            id,
            type: activeTool,
            points: currentPoints.value,
          },
        ]);
      }

      currentPoints.value = [];
    });

  const draggingGesture = Gesture.Pan()
    .minDistance(10)
    .runOnJS(true)
    .onBegin(() => {
      if (!selectedObject) return;
      dragStartX.value = selectedObject.x;
      dragStartY.value = selectedObject.y;
    })
    .onUpdate((e) => {
      if (!selectedObject) return;
      const { scale } = getSvgOffset(layout, VB_WIDTH, VB_HEIGHT, halfCourt);

      dragX.value = dragStartX.value + e.translationX / scale;
      dragY.value = dragStartY.value + e.translationY / scale;
    })
    .onEnd(() => {
      if (!selectedObject) return;

      const newX = dragX.value;
      const newY = dragY.value;

      if (PLAYER_TOOLS.includes(selectedObject.type)) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === selectedObject.id ? { ...p, x: newX, y: newY } : p,
          ),
        );
      }

      if (ITEM_TOOLS.includes(selectedObject.type)) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === selectedObject.id ? { ...p, x: newX, y: newY } : p,
          ),
        );
      }

      setSelectedObject({
        ...selectedObject,
        x: newX,
        y: newY,
      });
    });

  function handleSelection(x, y) {
    const selected = detectObjectAtPosition(x, y);
    if (selected) {
      dragStartX.value = selected.x;
      dragStartY.value = selected.y;

      dragX.value = selected.x;
      dragY.value = selected.y;
      setSelectedObject(selected);
    }
  }

  function detectObjectAtPosition(x, y) {
    const tokenThreshold = 12;

    const { offsetX, offsetY, scale } = getSvgOffset(
      layout,
      VB_WIDTH,
      VB_HEIGHT,
      halfCourt,
    );

    const touch = { x: (x - offsetX) / scale, y: (y - offsetY) / scale };

    // Buscar jugadores
    for (let player of players) {
      const playerPos = { x: player.x + 20, y: player.y + 20 };

      const dist = getDistance(touch, playerPos);

      if (dist < tokenThreshold) {
        return player;
      }
    }

    for (let item of items) {
      const itemPos = { x: item.x + 20, y: item.y + 20 };

      const dist = getDistance(touch, itemPos);

      if (dist < tokenThreshold) {
        return item;
      }
    }

    return null;
  }

  function distancePointToSegment(p, v, w) {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;

    if (l2 === 0) return getDistance(p, v);

    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));

    const projection = {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y),
    };

    return getDistance(p, projection);
  }

  const animatedProps = useAnimatedProps(() => {
    if (currentPoints.value.length === 0) return { d: "" };

    const d = currentPoints.value
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return { d };
  });

  const composedGesture = Gesture.Race(principalGesture, draggingGesture);

  useEffect(() => console.log(selectedObject), [selectedObject]);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composedGesture}>
        <View
          className="relative flex-1"
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setLayout({ width, height });
          }}
        >
          <Svg
            viewBox={`0 0 ${VB_WIDTH} ${halfCourt ? VB_HEIGHT / 2 : VB_HEIGHT}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          >
            {halfCourt ? <HalfCourt /> : <FullCourt />}
            {players.map((p) => (
              <DraggablePlayer
                key={p.id}
                data={p}
                dragX={dragX}
                dragY={dragY}
              />
            ))}
            {items.map((item) => (
              <DraggableItems
                key={item.id}
                data={item}
                dragX={dragX}
                dragY={dragY}
              />
            ))}

            <Svg
              style={{
                position: "absolute",
                inset: 0,
              }}
            >
              <AnimatedPath
                animatedProps={animatedProps}
                stroke="#111"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Svg>

          {/* 
          {lines.map((line) => (
            <LinesLayer key={line.id} line={line} />
          ))}

      */}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Playbook;
