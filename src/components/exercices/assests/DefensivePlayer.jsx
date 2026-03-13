import Svg, { G, Line, Text as SvgText } from "react-native-svg";

const DefensivePlayer = ({ label }) => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40">
      <G>
        <Line x1="15" y1="15" x2="25" y2="25" stroke="red" strokeWidth="1.5" />
        <Line x1="25" y1="15" x2="15" y2="25" stroke="red" strokeWidth="1.5" />

        <SvgText
          x="29"
          y="25"
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
          fill="red"
        >
          {label}
        </SvgText>
      </G>
    </Svg>
  );
};

export default DefensivePlayer;
