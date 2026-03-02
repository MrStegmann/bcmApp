import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { usePlaybookStore } from "../../store/PlaybookStore";
import OffesinvePlayer from "./assests/OffesinvePlayer";
import DefensivePlayer from "./assests/DefensivePlayer";
import TokenEnums from "../../Enums/TokenEnums";

const DraggablePlayer = ({ data, setPlayers, players }) => {
  const setSelectedObject = usePlaybookStore(
    (state) => state.setSelectedObject,
  );
  const selectedObject = usePlaybookStore((state) => state.selectedObject);
  const setActiveTool = usePlaybookStore((state) => state.setActiveTool);
  const x = useSharedValue(data.x - 20); // Centrar el círculo en la posición x
  const y = useSharedValue(data.y - 20);
  // Guardamos la posición inicial del toque para evitar saltos
  const savedX = useSharedValue(data.x - 20);
  const savedY = useSharedValue(data.y - 20);

  // NUEVO SISTEMA DE GESTOS (Reanimated 3)
  const panGesture = Gesture.Pan()
    .minDistance(2)
    .onBegin(() => {
      runOnJS(setSelectedObject)(data);
      runOnJS(setActiveTool)("");
    })
    .onUpdate((event) => {
      // Actualizamos la posición sumando el desplazamiento al origen guardado
      x.value = savedX.value + event.translationX;
      y.value = savedY.value + event.translationY;
    })
    .onEnd(() => {
      // Al soltar, guardamos la nueva posición como base para el siguiente toque
      savedX.value = x.value;
      savedY.value = y.value;
      runOnJS(setPlayers)([
        ...players.filter((p) => p.id !== data.id),
        {
          ...data,
          x: savedX.value,
          y: savedY.value,
        },
      ]);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 30,
            height: 30,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: selectedObject?.id === data.id ? 1 : 0,
            borderColor: "red",
            borderRadius: 9999,
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
    </GestureDetector>
  );
};

export default DraggablePlayer;
