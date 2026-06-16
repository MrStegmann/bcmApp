import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";

const DefensivePlayer = ({ label }: { label: string }) => {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40">
      {/* Brazos (Semiluna más larga, más gruesa, alineada al fondo y terminando en picos) */}
      <Path 
        d="M 0 12 Q 20 24 40 12 Q 20 54 0 12 Z" 
        fill="red" 
      />
      
      {/* Cuerpo */}
      <Circle
        cx="20"
        cy="20"
        r="12"
        fill="#ffc4c4"
        stroke="red"
        strokeWidth="2"
      />

      {/* Texto */}
      <SvgText
        x="20"
        y="25"
        fontSize="13"
        fontWeight="bold"
        textAnchor="middle"
        fill="red"
      >
        {label}
      </SvgText>
    </Svg>
  );
};

export default DefensivePlayer;
