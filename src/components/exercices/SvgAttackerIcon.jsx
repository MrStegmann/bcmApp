import Svg, { Path, Defs, Marker, Circle, Text } from "react-native-svg";

const SvgAttackerIcon = () => (
  <Svg
    width="22"
    height="22"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle
      cx="12"
      cy="12"
      r="10"
      fill="#transparent"
      stroke="blue"
      strokeWidth="1.5"
    />
    <Text
      x="12"
      y="17"
      fontSize="14"
      fontWeight="bold"
      fill="blue"
      textAnchor="middle"
    >
      A
    </Text>
  </Svg>
);

export default SvgAttackerIcon;
