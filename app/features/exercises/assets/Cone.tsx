import Svg, { Polygon, G, Rect, Path } from "react-native-svg";

const Cone = () => {
  return (
    <Svg width="20" height="20" viewBox="0 0 500 500">
      <G>
        <Polygon points="367,308 133,308 102,405 399,405 " fill={"red"} />
        <Path
          d="M195 122l109 0 -27 -80c-2,-7 -7,-12 -16,-12l-24 0c-8,0 -13,5 -15,12l-27 80z"
          fill={"red"}
        />
        <Polygon points="336,216 164,216 133,310 367,310 " fill={"white"} />
        <Rect
          x="58"
          y="405"
          width="384.722"
          height="64.6701"
          rx="12"
          ry="12"
          fill={"red"}
        />
        <Polygon points="336,216 164,216 195,122 304,122 " fill={"red"} />
      </G>
    </Svg>
  );
};

export default Cone;
