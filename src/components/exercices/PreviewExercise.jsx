import { View } from "react-native-web";
import HalfCourt from "./assests/HalfCourt";
import FullCourt from "./assests/FullCourt";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TokenEnums from "../../Enums/TokenEnums";
import Ball from "./assests/Ball";
import HandByHand from "./assests/HandByHand";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import OffesinvePlayer from "./assests/OffesinvePlayer";
import DefensivePlayer from "./assests/DefensivePlayer";
import Svg, { G, Path } from "react-native-svg";

const ItemToken = ({ data }) => {
  const x = useSharedValue(data.x - 20); // Centrar el círculo en la posición x
  const y = useSharedValue(data.y - 20);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 20,
          height: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      {data.type === TokenEnums.BALL && <Ball />}
      {data.type === TokenEnums.CONE && (
        <MaterialCommunityIcons name="traffic-cone" size={24} color="#e04000" />
      )}
      {data.type === TokenEnums.HAND_BY_HAND && <HandByHand />}
    </Animated.View>
  );
};

const PlayerToken = ({ data }) => {
  const x = useSharedValue(data.x - 20); // Centrar el círculo en la posición x
  const y = useSharedValue(data.y - 20);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 20,
          height: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      {data.type === TokenEnums.OFFENSIVE && (
        <OffesinvePlayer label={data.label} />
      )}
      {data.type === TokenEnums.DEFENSIVE && (
        <DefensivePlayer label={data.label} />
      )}
    </Animated.View>
  );
};

const LinesLayer = ({ line }) => {
  function getBlockHead(p1, p2, size = 15) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;

    const unitX = dx / len;
    const unitY = dy / len;
    const perpX = -unitY * size;
    const perpY = unitX * size;

    const left = { x: p2.x + perpX / 2, y: p2.y + perpY / 2 };
    const right = { x: p2.x - perpX / 2, y: p2.y - perpY / 2 };

    return { left, right };
  }

  function applyZigzag(points, amplitude = 6) {
    if (!points || points.length < 2) return points;

    return points.map((p, i, arr) => {
      if (i === 0 || i === 1 || i === arr.length - 1 || i === arr.length - 2)
        return p; // inicio y fin sin modificar
      const prev = arr[i - 1];
      const next = arr[i + 1];

      // vector perpendicular al segmento anterior
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const length = Math.hypot(dx, dy);
      const offsetX = (-dy / length) * amplitude * (i % 2 === 0 ? 1 : -1);
      const offsetY = (dx / length) * amplitude * (i % 2 === 0 ? 1 : -1);

      return { x: p.x + offsetX, y: p.y + offsetY };
    });
  }

  function getArrowHead(p1, p2, size = 10, angle = Math.PI / 6) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const theta = Math.atan2(dy, dx);

    const left = {
      x: p2.x - size * Math.cos(theta - angle),
      y: p2.y - size * Math.sin(theta - angle),
    };

    const right = {
      x: p2.x - size * Math.cos(theta + angle),
      y: p2.y - size * Math.sin(theta + angle),
    };

    return { left, right };
  }

  const pointsToUse =
    line.type === TokenEnums.DRIBBLING_LINE
      ? applyZigzag(line.points)
      : line.points;
  const d = pointsToUse
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const p2 = line.points.at(-1);
  const p1 = line.points.at(-2);
  const { left, right } = [
    TokenEnums.MOVEMENT_LINE,
    TokenEnums.DRIBBLING_LINE,
    TokenEnums.PASS_LINE,
  ].includes(line.type)
    ? getArrowHead(p1, p2)
    : getBlockHead(p1, p2);

  return (
    <Svg
      style={{
        position: "absolute",
        inset: 0,
      }}
    >
      <G>
        <Path
          d={d}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={line.type === TokenEnums.PASS_LINE ? "6,4" : ""}
        />
        {[
          TokenEnums.MOVEMENT_LINE,
          TokenEnums.DRIBBLING_LINE,
          TokenEnums.PASS_LINE,
        ].includes(line.type) ? (
          <G>
            <Path
              d={`M ${left.x} ${left.y} L ${p2.x} ${p2.y}`}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Path
              d={`M ${right.x} ${right.y} L ${p2.x} ${p2.y}`}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </G>
        ) : (
          <Path
            d={`M ${left.x} ${left.y} L ${right.x} ${right.y}`}
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
      </G>
    </Svg>
  );
};

const PreviewExercise = ({ exercise }) => {
  const { players, items, lines } = exercise.stages[0] || {
    players: [],
    items: [],
    lines: [],
  };

  return (
    <View className="relative flex-1">
      <Svg height={"100%"} width={"100%"}>
        {exercise.halfcourt ? <HalfCourt /> : <FullCourt />}
        {players.map((p) => (
          <PlayerToken key={p.id} data={p} />
        ))}
        {items.map((p) => (
          <ItemToken key={p.id} data={p} />
        ))}
        {lines.map((l) => (
          <LinesLayer key={l.id} line={l} />
        ))}
      </Svg>
    </View>
  );
};

export default PreviewExercise;
