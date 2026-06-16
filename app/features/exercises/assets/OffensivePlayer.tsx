import Svg, { Circle, Text as SvgText } from "react-native-svg";

const OffensivePlayer = ({ label }: { label: string }) => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40">
      <Circle
        cx="20"
        cy="20"
        r="12"
        fill="#c4e0ff"
        stroke={"#3582db"}
        strokeWidth="2"
      />
      <SvgText
        x="20"
        y="25"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        fill={"#3582db"}
      >
        {label}
      </SvgText>
    </Svg>
  );
};

export default OffensivePlayer;
