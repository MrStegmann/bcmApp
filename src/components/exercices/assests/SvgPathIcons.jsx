import Svg, { Path, Defs, Marker } from "react-native-svg";

const SvgPathIcons = ({ path }) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 -12 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Defs>
        <Marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="0"
          refY="0"
          orient="auto"
        >
          <Path
            d="M0,0 L-2,2 L-2,-2 L0,0"
            fill="black"
            stroke="black"
            strokeWidth="1"
          />
        </Marker>
        <Marker
          id="hammerhead"
          markerWidth="8"
          markerHeight="8"
          refX="0"
          l
          refY="3.5"
          orient="auto"
        >
          <Path d="M0,0 L0,7" fill="black" stroke="black" strokeWidth="1" />
        </Marker>
      </Defs>
      {path === "run" && (
        <Path
          d="M0,0 L20,0"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="none"
          strokeLinejoin="none"
          markerEnd={`url(#arrowhead)`}
        />
      )}
      {path === "pass" && (
        <Path
          d="M0,0 L20,0"
          stroke="black"
          strokeWidth="2"
          strokeDasharray={"6,4"}
          strokeLinecap="none"
          strokeLinejoin="none"
          markerEnd={`url(#arrowhead)`}
        />
      )}
      {path === "block" && (
        <Path
          d="M0,0 L20,0"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="none"
          strokeLinejoin="none"
          markerEnd={`url(#hammerhead)`}
        />
      )}
      {path === "dribling" && (
        <Path
          d="M0,0 L4,5 L8,-5 L12,5 L14,0 L20,0"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="none"
          strokeLinejoin="none"
          markerEnd={`url(#arrowhead)`}
        />
      )}
    </Svg>
  );
};

const DriblingPath = () => (
  <Svg
    version="1.1"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    style="overflow: hidden;"
  >
    <Desc>Created with Snap</Desc>
    <Defs></Defs>
    <Path
      d="m 3,16.5 1,0 c 2,0 2,2 4,2 2,0 2,-2 4,-2 2,0 2,2 4,2 2,0 2,-2 4,-2 l 1,0"
      fill="none"
      stroke="#000000"
      style="stroke-width: 2;"
    ></Path>
    <Path
      d="m 26,17 -5,-5 0,10 z"
      fill="#000000"
      style="stroke-width: 0;"
    ></Path>
  </Svg>
);

export default SvgPathIcons;
