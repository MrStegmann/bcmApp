import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedProps,
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

  // Gestor principal
  const gesture = React.useMemo(
    () =>
      Gesture.Tap().onEnd((e) => {
        if (selectedObject) return;
        if ([TokenEnums.OFFENSIVE, TokenEnums.DEFENSIVE].includes(activeTool)) {
          runOnJS(setPlayers)([
            ...players,
            {
              id: Date.now().toString(),
              type: activeTool,
              x: e.x,
              y: e.y,
              label: `${players.filter((p) => p.type === activeTool).length + 1}`,
            },
          ]);
        }

        if (
          [TokenEnums.BALL, TokenEnums.CONE, TokenEnums.HAND_BY_HAND].includes(
            activeTool,
          )
        ) {
          runOnJS(setItems)([
            ...items,
            {
              id: Date.now().toString(),
              type: activeTool,
              x: e.x,
              y: e.y,
            },
          ]);
        }
        if (
          [
            TokenEnums.MOVEMENT_LINE,
            TokenEnums.PASS_LINE,
            TokenEnums.BLOCK_LINE,
            TokenEnums.DRIBBLING_LINE,
          ].includes(activeTool)
        ) {
          if (currentPoints.value.length < 2) {
            currentPoints.value = [];
            return;
          }

          runOnJS(setLines)([
            ...lines,
            {
              id: Date.now().toString(),
              type: activeTool,
              points: currentPoints.value,
            },
          ]);
        }

        currentPoints.value = [];
      }),
    [
      activeTool,
      items,
      setItems,
      players,
      setPlayers,
      setLines,
      lines,
      selectedObject,
    ],
  );

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      if (
        [
          TokenEnums.MOVEMENT_LINE,
          TokenEnums.PASS_LINE,
          TokenEnums.BLOCK_LINE,
          TokenEnums.DRIBBLING_LINE,
        ].includes(activeTool) &&
        !selectedObject
      ) {
        currentPoints.value = [{ x: e.x, y: e.y }];
      }
    })
    .onUpdate((e) => {
      if (
        [
          TokenEnums.BLOCK_LINE,
          TokenEnums.DRIBBLING_LINE,
          TokenEnums.MOVEMENT_LINE,
        ].includes(activeTool)
      ) {
        const last = currentPoints.value.at(-1);
        if (!last) return;

        const dx = e.x - last.x;
        const dy = e.y - last.y;

        // evita exceso de puntos
        if (Math.hypot(dx, dy) > 8) {
          currentPoints.value = [...currentPoints.value, { x: e.x, y: e.y }];
        }
      }

      if (activeTool === TokenEnums.PASS_LINE) {
        if (currentPoints.value.length === 0) return;

        // solo guardamos el último punto como fin
        currentPoints.value = [currentPoints.value[0], { x: e.x, y: e.y }];
      }
    })
    .onEnd(() => {
      if (
        [
          TokenEnums.MOVEMENT_LINE,
          TokenEnums.PASS_LINE,
          TokenEnums.BLOCK_LINE,
          TokenEnums.DRIBBLING_LINE,
        ].includes(activeTool)
      ) {
        if (currentPoints.value.length < 2) {
          currentPoints.value = [];
          return;
        }

        runOnJS(setLines)([
          ...lines,
          {
            id: Date.now().toString(),
            type: activeTool,
            points: currentPoints.value,
          },
        ]);
      }

      currentPoints.value = [];
    });

  // Gestos para seleccionar lineas
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd((e) => runOnJS(handleLineSelection)(e.x, e.y));

  const animatedProps = useAnimatedProps(() => {
    if (currentPoints.value.length === 0) return { d: "" };

    const d = currentPoints.value
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return { d };
  });

  // Funciones de selección de lineas: detecta si el toque está cerca de alguna línea y la selecciona
  function distancePointToSegment(p, v, w) {
    const l2 = (w.x - v.x) * (w.x - v.x) + (w.y - v.y) * (w.y - v.y);

    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);

    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

    t = Math.max(0, Math.min(1, t));

    const projection = {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y),
    };

    return Math.hypot(p.x - projection.x, p.y - projection.y);
  }
  function handleLineSelection(x, y) {
    const threshold = 10; // sensibilidad táctil

    for (let line of lines) {
      const pts = line.points;

      for (let i = 0; i < pts.length - 1; i++) {
        const dist = distancePointToSegment({ x, y }, pts[i], pts[i + 1]);

        if (dist < threshold) {
          setSelectedObject(line);
          setActiveTool("");
          return;
        }
      }
    }
  }

  const composedGesture = Gesture.Simultaneous(tapGesture, gesture, panGesture);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composedGesture}>
        <View className="relative flex-1">
          {halfCourt ? <HalfCourt /> : <FullCourt />}

          {players.map((p) => (
            <DraggablePlayer
              key={p.id}
              data={p}
              setPlayers={setPlayers}
              players={players}
            />
          ))}
          {items.map((item) => (
            <DraggableItems
              key={item.id}
              data={item}
              setItems={setItems}
              items={items}
            />
          ))}
          {lines.map((line) => (
            <LinesLayer key={line.id} line={line} />
          ))}

          {/* preview */}
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
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Playbook;
