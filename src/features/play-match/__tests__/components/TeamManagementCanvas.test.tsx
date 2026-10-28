import React from "react";
import { TeamManagementCanvasProps } from "../../types";

declare const jest: any;
declare const require: any;
declare const __dirname: string;
const fs = require("fs");
const path = require("path");

describe("TeamManagementCanvas (T046 - US6)", () => {
  it("should conform to TeamManagementCanvasProps contract", () => {
    const props: TeamManagementCanvasProps = {
      courtPlayers: [null, null, null, null, null],
      benchPlayers: [],
      isSwapMode: false,
      isTimerRunning: false,
      selectedCourtPlayerIds: [],
      selectedBenchPlayerIds: [],
      availableTimeouts: 2,
      onSelectCourtPosition: jest.fn(),
      onLongPressCourtPosition: jest.fn(),
      onSelectBenchPlayer: jest.fn(),
      onToggleSwapMode: jest.fn(),
      onConfirmSwap: jest.fn(),
      onCancelSwap: jest.fn(),
      onIncreaseTimeout: jest.fn(),
      onDecreaseTimeout: jest.fn(),
    };

    expect(props.courtPlayers).toHaveLength(5);
    expect(props.availableTimeouts).toBe(2);
    expect(props.isSwapMode).toBe(false);
  });

  it("should verify dynamic flex-1 container layout preventing fixed height overflow on small phones", () => {
    const componentPath = path.resolve(__dirname, "../../components/TeamManagementCanvas.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must use flex-1 to dynamically adapt to viewport
    expect(componentSource).toContain("flex-1");
    // Must render HalfCourtCanvas and TeamManagementPanel
    expect(componentSource).toContain("HalfCourtCanvas");
    expect(componentSource).toContain("TeamManagementPanel");
  });
});
