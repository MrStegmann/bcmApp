import React from "react";
import { View } from "react-native";
import Svg, { Polygon, Line, Circle, Text as SvgText, G } from "react-native-svg";
import { PolygonRadarChartProps } from "../types";
import { generateRadarGeometry } from "../utils/radarGeometry";

export const PolygonRadarChart: React.FC<PolygonRadarChartProps> = ({
  stats,
  size = 280,
}) => {
  const center = size / 2;
  const outerRadius = center * 0.64;
  const labelRadius = center * 0.82;
  const geometry = generateRadarGeometry(stats, size);

  return (
    <View
      className="items-center justify-center py-2"
      testID="polygon-radar-chart-container"
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric Grid Webs */}
        <G>
          {geometry.gridPolygons.map((points, idx) => (
            <Polygon
              key={`grid-${idx}`}
              points={points}
              fill={idx === 3 ? "rgba(23, 31, 51, 0.4)" : "none"}
              stroke="#334155"
              strokeWidth={idx === 3 ? "1.5" : "1"}
              strokeDasharray={idx < 3 ? "3, 3" : undefined}
            />
          ))}
        </G>

        {/* 8 Axis Spokes */}
        <G>
          {geometry.axes.map((axis, idx) => {
            const angleRad = (axis.angleDeg * Math.PI) / 180;
            const spokeX = center + outerRadius * Math.cos(angleRad);
            const spokeY = center + outerRadius * Math.sin(angleRad);

            return (
              <Line
                key={`spoke-${idx}`}
                x1={center}
                y1={center}
                x2={spokeX}
                y2={spokeY}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}
        </G>

        {/* Data Polygon Fill & Stroke */}
        <Polygon
          points={geometry.polygonPointsSvg}
          fill="rgba(14, 165, 233, 0.25)"
          stroke="#0EA5E9"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vertex Data Points */}
        <G>
          {geometry.axes.map((axis, idx) => (
            <Circle
              key={`vertex-${idx}`}
              cx={axis.x}
              cy={axis.y}
              r="4"
              fill="#0EA5E9"
              stroke="#00A2E6"
              strokeWidth="2"
            />
          ))}
        </G>

        {/* Axis Labels & Calculated Values */}
        <G>
          {geometry.axes.map((axis, idx) => {
            const angleRad = (axis.angleDeg * Math.PI) / 180;
            const lx = center + labelRadius * Math.cos(angleRad);
            const ly = center + labelRadius * Math.sin(angleRad);

            return (
              <G key={`axis-group-${idx}`}>
                <SvgText
                  x={lx}
                  y={ly - 2}
                  fontSize="9"
                  fontWeight="bold"
                  fill="#DAE2FD"
                  textAnchor="middle"
                  testID={`radar-axis-label-${axis.key}`}
                >
                  {axis.label}
                </SvgText>
                <SvgText
                  x={lx}
                  y={ly + 9}
                  fontSize="8"
                  fontWeight="600"
                  fill="#A78B7D"
                  textAnchor="middle"
                >
                  {axis.formattedValue}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default PolygonRadarChart;
