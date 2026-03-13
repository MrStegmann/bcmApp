import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { usePlaybookStore } from "../../store/PlaybookStore";
import OffesinvePlayer from "./assests/OffesinvePlayer";
import DefensivePlayer from "./assests/DefensivePlayer";
import TokenEnums from "../../Enums/TokenEnums";
import { Circle, G } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

const DraggablePlayer = ({ data, dragX, dragY }) => {
  const selectedObject = usePlaybookStore((state) => state.selectedObject);

  const animatedStyle = useAnimatedStyle(() => {
    if (selectedObject?.id === data.id) {
      return {
        transform: [{ translateX: dragX.value }, { translateY: dragY.value }],
      };
    }

    return {
      transform: [{ translateX: data.x }, { translateY: data.y }],
    };
  });

  return (
    <AnimatedG style={animatedStyle}>
      <Circle
        cx={20}
        cy={20}
        r={15}
        strokeWidth={2}
        stroke={selectedObject?.id === data.id ? "red" : "transparent"}
        fill="transparent"
      />
      {data.type === TokenEnums.OFFENSIVE && (
        <OffesinvePlayer label={data.label} />
      )}
      {data.type === TokenEnums.DEFENSIVE && (
        <DefensivePlayer label={data.label} />
      )}
    </AnimatedG>
  );
};

export default DraggablePlayer;
