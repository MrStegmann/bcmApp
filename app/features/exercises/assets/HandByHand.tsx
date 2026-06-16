import Svg, { Line, G } from "react-native-svg";

const HandByHand = () => {
  return (
    <Svg width="30" height="30" viewBox="0 0 60 60">
      <G>
        <Line
          x1="20"
          y1="10"
          x2="20"
          y2="50"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <Line
          x1="40"
          y1="10"
          x2="40"
          y2="50"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <Line
          x1="10"
          y1="30"
          x2="50"
          y2="30"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};

export default HandByHand;
