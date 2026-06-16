import React from "react";
import Svg, { Rect, Path, Circle, Line, G } from "react-native-svg";

const VB_WIDTH = 384;
const VB_HEIGHT = 300;

const MARGIN = 20;
const COURT_WIDTH = VB_WIDTH - MARGIN * 2;
const COURT_HEIGHT = VB_HEIGHT - MARGIN * 2;

const CENTER_X = VB_WIDTH / 2;

const CENTER_CIRCLE_RADIUS = VB_WIDTH * 0.12;
const CENTER_CIRCLE_Y = VB_HEIGHT - MARGIN;

const HalfCourt = () => {
  return (
    <Svg
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <Rect width={VB_WIDTH} height={VB_HEIGHT} fill="#8dbee0" />

      {/* Outer lines */}
      <Rect
        x={MARGIN}
        y={MARGIN}
        width={COURT_WIDTH}
        height={COURT_HEIGHT}
        fill="#e6f0f7"
        stroke="#005994"
        strokeWidth={3}
      />

      {/* Jump circle */}
      <Path
        d={`
          M ${CENTER_X - CENTER_CIRCLE_RADIUS} ${CENTER_CIRCLE_Y}
          A ${CENTER_CIRCLE_RADIUS} ${CENTER_CIRCLE_RADIUS} 0 0 1
          ${CENTER_X + CENTER_CIRCLE_RADIUS} ${CENTER_CIRCLE_Y}
        `}
        fill="none"
        stroke="#005994"
        strokeWidth={3}
      />

      {/* === TOP HALF === */}
      <G>
        {/* Paint */}
        <Rect
          x={CENTER_X - VB_WIDTH * 0.125}
          y={MARGIN}
          width={VB_WIDTH * 0.25}
          height={VB_HEIGHT * 0.4}
          fill="#8dbee0"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Free throw circle */}
        <Circle
          cx={CENTER_X}
          cy={VB_HEIGHT * 0.47}
          r={VB_WIDTH * 0.1}
          fill="none"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Three point line */}
        <Path
          d={`
            M ${MARGIN + 27} ${MARGIN}
            L ${MARGIN + 27} ${VB_HEIGHT * 0.35}
            A ${VB_WIDTH * 0.4} ${VB_HEIGHT * 0.5} 0 0 0 ${VB_WIDTH - MARGIN - 27} ${VB_HEIGHT * 0.35}
            L ${VB_WIDTH - MARGIN - 27} ${MARGIN}
          `}
          fill="none"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Backboard */}
        <Line
          x1={CENTER_X - 20}
          y1={MARGIN + 16}
          x2={CENTER_X + 20}
          y2={MARGIN + 16}
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Rim */}
        <Circle
          cx={CENTER_X}
          cy={MARGIN + 28}
          r={8}
          fill="none"
          stroke="#005994"
          strokeWidth={2}
        />
      </G>
    </Svg>
  );
};

export default HalfCourt;
