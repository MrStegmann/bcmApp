import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { usePlaybookStore } from "../../store/PlaybookStore";
import Ball from "./assests/Ball";
import TokenEnums from "../../Enums/TokenEnums";
import HandByHand from "./assests/HandByHand";
import { Circle, G } from "react-native-svg";
import Cone from "./assests/Cone";

const AnimatedG = Animated.createAnimatedComponent(G);

const DraggableItems = ({ data, dragX, dragY }) => {
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
        cx={10}
        cy={10}
        r={15}
        strokeWidth={2}
        stroke={selectedObject?.id === data.id ? "red" : "transparent"}
        fill="transparent"
      />
      {data.type === TokenEnums.BALL && <Ball />}
      {data.type === TokenEnums.CONE && <Cone />}
      {data.type === TokenEnums.HAND_BY_HAND && <HandByHand />}
    </AnimatedG>
  );
};

export default DraggableItems;
