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
              fill={idx === 3 ? "rgba(30, 41, 59, 0.4)" : "none"}
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
                stroke="#475569"
                strokeWidth="1"
              />
            );
          })}
        </G>

        {/* Data Polygon Fill & Stroke */}
        <Polygon
          points={geometry.polygonPointsSvg}
          fill="rgba(56, 189, 248, 0.3)"
          stroke="#38bdf8"
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
              fill="#38bdf8"
              stroke="#0369a1"
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
                  fill="#cbd5e1"
                  textAnchor="middle"
                  testID={`radar-axis-label-${axis.key}`}
                >
                  {axis.label}
                </SvgText>
                <SvgText
                  x={lx}
                  y={ly + 9}
                  fontSize="9"
                  fontWeight="bold"
                  fill="#38bdf8"
                  textAnchor="middle"
                  testID={`radar-axis-value-${axis.key}`}
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
