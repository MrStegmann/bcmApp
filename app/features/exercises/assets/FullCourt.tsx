import React from "react";
import Svg, { Rect, Path, Circle, Line, G } from "react-native-svg";

const VB_WIDTH = 384;
const VB_HEIGHT = 540;

const MARGIN = 20;
const COURT_WIDTH = VB_WIDTH - MARGIN * 2;
const COURT_HEIGHT = VB_HEIGHT - MARGIN * 2;

const CENTER_X = VB_WIDTH / 2;
const CENTER_Y = VB_HEIGHT / 2;

const FullCourt = () => {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
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

      {/* Center line */}
      <Line
        x1={MARGIN}
        y1={CENTER_Y}
        x2={VB_WIDTH - MARGIN}
        y2={CENTER_Y}
        stroke="#005994"
        strokeWidth={3}
      />

      {/* Jump circle */}
      <Circle
        cx={CENTER_X}
        cy={CENTER_Y}
        r={VB_WIDTH * 0.1}
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
          height={VB_HEIGHT * 0.2}
          fill="#8dbee0"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Free throw circle */}
        <Circle
          cx={CENTER_X}
          cy={VB_HEIGHT * 0.24}
          r={VB_WIDTH * 0.1}
          fill="none"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Three point line */}
        <Path
          d={`
            M ${MARGIN + 27} ${MARGIN}
            L ${MARGIN + 27} ${VB_HEIGHT * 0.18}
            A ${VB_WIDTH * 0.4} ${VB_HEIGHT * 0.25} 0 0 0 ${VB_WIDTH - MARGIN - 27} ${VB_HEIGHT * 0.18}
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

      {/* === BOTTOM HALF (rotated) === */}
      <G transform={`rotate(180 ${CENTER_X} ${CENTER_Y})`}>
        <Rect
          x={CENTER_X - VB_WIDTH * 0.125}
          y={MARGIN}
          width={VB_WIDTH * 0.25}
          height={VB_HEIGHT * 0.2}
          fill="#8dbee0"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Free throw circle */}
        <Circle
          cx={CENTER_X}
          cy={VB_HEIGHT * 0.24}
          r={VB_WIDTH * 0.1}
          fill="none"
          stroke="#005994"
          strokeWidth={3}
        />

        {/* Three point line */}
        <Path
          d={`
            M ${MARGIN + 27} ${MARGIN}
            L ${MARGIN + 27} ${VB_HEIGHT * 0.18}
            A ${VB_WIDTH * 0.4} ${VB_HEIGHT * 0.25} 0 0 0 ${VB_WIDTH - MARGIN - 27} ${VB_HEIGHT * 0.18}
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

export default FullCourt;
