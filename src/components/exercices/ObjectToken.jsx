import { View, Text, PanResponder } from "react-native-web";
import { useRef, useEffect } from "react";
import TokenEnums from "../../Enums/TokenEnums";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { usePlaybookStore } from "../../store/PlaybookStore";

export default function ObjectToken({ token, courtSize, onMove, onSelect }) {
  if (!token) return null;
  const { objectId, setObjectSelected } = usePlaybookStore((state) => state);
  const clamp = (v) => Math.max(0, Math.min(1, v));

  const currentTokenRef = useRef(token);

  useEffect(() => {
    currentTokenRef.current = token;
  }, [token]);

  const startPos = useRef({ x: token.x, y: token.y });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setObjectSelected(null);
        onSelect();
        const currentToken = currentTokenRef.current;

        startPos.current = { x: currentToken.x, y: currentToken.y };
      },
      onPanResponderMove: (_, g) => {
        const x = clamp(startPos.current.x + g.dx / courtSize.width);
        const y = clamp(startPos.current.y + g.dy / courtSize.height);
        onMove(x, y);
      },
    }),
  ).current;

  const styleByType = {
    attack: { color: "#2979FF", label: token.label, zIndex: 20 },
    defense: { color: "#E53935", label: token.label, zIndex: 10 },
    ball: { color: "#F88158", icon: "basketball", zIndex: 40 },
    cone: { color: "red", icon: "traffic-cone", zIndex: 30 },
  };

  return (
    <View
      {...panResponder.panHandlers}
      className={`absolute w-10 h-10 rounded-full justify-center items-center`}
      style={[
        {
          zIndex: styleByType[token.type].zIndex,
          backgroundColor: styleByType[token.type].label
            ? styleByType[token.type].color
            : null,
          borderColor: objectId === token.id && "red",
          borderWidth: objectId === token.id ? 1 : 0,
          left: token.x * courtSize.width - 18,
          top: token.y * courtSize.height - 18,
        },
      ]}
    >
      {styleByType[token.type].label ? (
        <Text className="text-white">{styleByType[token.type].label}</Text>
      ) : (
        <MaterialCommunityIcons
          name={styleByType[token.type].icon}
          size={20}
          color={styleByType[token.type].color}
        />
      )}
    </View>
  );
}
