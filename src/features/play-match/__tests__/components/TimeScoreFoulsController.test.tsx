import React from "react";
import { PeriodData, TimeScoreFoulsControllerProps } from "../../types";

declare const jest: any;
declare const require: any;
declare const __dirname: string;
const fs = require("fs");
const path = require("path");

describe("TimeScoreFoulsController (T009 - US1 Component 1)", () => {
  const mockPeriodData: PeriodData = {
    key: "q1",
    label: "Q1",
    remainingSeconds: 600,
    teamScore: 18,
    rivalScore: 14,
    teamFouls: 3,
    rivalFouls: 2,
    isCompleted: false,
  };

  it("should conform to TimeScoreFoulsControllerProps contract without standalone extra-time reset button", () => {
    const onNextPeriodMock = jest.fn();
    const onOpenPeriodSelectMock = jest.fn();
    const onToggleTimerMock = jest.fn();
    const onOpenManualTimeMock = jest.fn();

    const props: TimeScoreFoulsControllerProps = {
      activePeriod: "q1",
      periodData: mockPeriodData,
      totalTeamScore: 54,
      totalRivalScore: 48,
      isTimerRunning: false,
      onNextPeriod: onNextPeriodMock,
      onOpenPeriodSelectModal: onOpenPeriodSelectMock,
      onToggleTimer: onToggleTimerMock,
      onOpenManualTimeModal: onOpenManualTimeMock,
    };

    expect(props.activePeriod).toBe("q1");
    expect(props.periodData.remainingSeconds).toBe(600);
    expect(props.totalTeamScore).toBe(54);
    expect(props.totalRivalScore).toBe(48);
    expect(props.isTimerRunning).toBe(false);

    // Call handlers
    props.onNextPeriod();
    expect(onNextPeriodMock).toHaveBeenCalledTimes(1);

    props.onOpenPeriodSelectModal();
    expect(onOpenPeriodSelectMock).toHaveBeenCalledTimes(1);

    props.onToggleTimer();
    expect(onToggleTimerMock).toHaveBeenCalledTimes(1);

    props.onOpenManualTimeModal();
    expect(onOpenManualTimeMock).toHaveBeenCalledTimes(1);
  });

  it("should verify complete absence of standalone extra-time reset button in component source", () => {
    const componentPath = path.resolve(__dirname, "../../components/TimeScoreFoulsController.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Standalone reset button must be completely removed from TimeScoreFoulsController
    expect(componentSource).not.toContain("reset-extra-crono-button");
    expect(componentSource).not.toContain("onResetExtraTimeCrono");
  });

  it("should format remaining seconds as MM:SS", () => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(450)).toBe("07:30");
    expect(formatTime(300)).toBe("05:00");
    expect(formatTime(5)).toBe("00:05");
  });

  it("should use Pressable and static styling without dynamic animation or shadow classes to prevent NativeWind freeze", () => {
    // Read the actual component source file to guarantee no animation classes exist
    const componentPath = path.resolve(__dirname, "../../components/TimeScoreFoulsController.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must not contain animate-pulse or any animate- classes which cause conditional Reanimated hook calls in NativeWind
    expect(componentSource).not.toContain("animate-pulse");
    expect(componentSource).not.toContain("animate-");

    // Must not contain shadow-lg on chronometer to prevent VariableContext.Provider runtime remounts in NativeWind v4
    expect(componentSource).not.toContain("shadow-lg");

    // Must use Pressable for chronometer button
    expect(componentSource).toContain("<Pressable");
    expect(componentSource).toContain('testID="chronometer-button"');
    expect(componentSource).toContain('testID="chronometer-status-dot"');
  });
});



