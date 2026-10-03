import React from "react";
import { View } from "react-native";
import { TeamManagementCanvasProps } from "../types";
import { HalfCourtCanvas } from "./HalfCourtCanvas";
import { TeamManagementPanel } from "./TeamManagementPanel";

export const TeamManagementCanvas: React.FC<TeamManagementCanvasProps> = ({
  courtPlayers,
  benchPlayers,
  isSwapMode,
  isTimerRunning,
  selectedCourtPlayerIds,
  selectedBenchPlayerIds,
  availableTimeouts,
  onSelectCourtPosition,
  onSelectBenchPlayer,
  onToggleSwapMode,
  onConfirmSwap,
  onCancelSwap,
  onIncreaseTimeout,
  onDecreaseTimeout,
}) => {
  return (
    <View className="flex-1 justify-between">
      {/* Half Basketball Court Canvas */}
      <HalfCourtCanvas
        courtPlayers={courtPlayers}
        isSwapMode={isSwapMode}
        selectedCourtPlayerIds={selectedCourtPlayerIds}
        onSelectCourtPosition={onSelectCourtPosition}
      />

      {/* Bottom Team & Bench Management Panel */}
      <TeamManagementPanel
        benchPlayers={benchPlayers}
        isSwapMode={isSwapMode}
        isTimerRunning={isTimerRunning}
        selectedCourtCount={selectedCourtPlayerIds.length}
        selectedBenchPlayerIds={selectedBenchPlayerIds}
        availableTimeouts={availableTimeouts}
        onSelectBenchPlayer={onSelectBenchPlayer}
        onToggleSwapMode={onToggleSwapMode}
        onConfirmSwap={onConfirmSwap}
        onCancelSwap={onCancelSwap}
        onIncreaseTimeout={onIncreaseTimeout}
        onDecreaseTimeout={onDecreaseTimeout}
      />
    </View>
  );
};
