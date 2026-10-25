import React from "react";
import { RivalPanelControlProps } from "../../types";

declare const jest: any;
declare const require: any;
declare const __dirname: string;
const fs = require("fs");
const path = require("path");

describe("RivalPanelControl (T034 - US4 Component 3)", () => {
  it("should conform to RivalPanelControlProps contract", () => {
    const onAdjustScoreMock = jest.fn();
    const onAdjustFoulsMock = jest.fn();

    const props: RivalPanelControlProps = {
      activePeriod: "q1",
      rivalPeriodScore: 12,
      rivalPeriodFouls: 2,
      onAdjustRivalScore: onAdjustScoreMock,
      onAdjustRivalFouls: onAdjustFoulsMock,
    };

    expect(props.activePeriod).toBe("q1");
    expect(props.rivalPeriodScore).toBe(12);
    expect(props.rivalPeriodFouls).toBe(2);

    // Points
    props.onAdjustRivalScore(1);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(1);

    props.onAdjustRivalScore(2);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(2);

    props.onAdjustRivalScore(3);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(3);

    props.onAdjustRivalScore(-1);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(-1);

    // Fouls
    props.onAdjustRivalFouls(1);
    expect(onAdjustFoulsMock).toHaveBeenCalledWith(1);

    props.onAdjustRivalFouls(-1);
    expect(onAdjustFoulsMock).toHaveBeenCalledWith(-1);
  });

  it("should occupy full width (w-full) in component styling", () => {
    const componentPath = path.resolve(__dirname, "../../components/RivalPanelControl.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).toContain("w-full");
  });

  it("should omit duplicate rival total score element completely", () => {
    const componentPath = path.resolve(__dirname, "../../components/RivalPanelControl.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must NOT contain total score rendering
    expect(componentSource).not.toContain("totalRivalScore");
    expect(componentSource).not.toContain("Total:");
  });

  it("should NOT display ANY points or fouls counters in RivalPanelControl", () => {
    const componentPath = path.resolve(__dirname, "../../components/RivalPanelControl.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must NOT contain points or fouls counter values or labels
    expect(componentSource).not.toContain("rivalPeriodScore");
    expect(componentSource).not.toContain("rivalPeriodFouls");
    expect(componentSource).not.toContain("pts");
    expect(componentSource).not.toContain("faltas");

    // Must still contain adjustment buttons
    expect(componentSource).toContain("rival-minus-1");
    expect(componentSource).toContain("rival-plus-1");
    expect(componentSource).toContain("rival-plus-2");
    expect(componentSource).toContain("rival-plus-3");
    expect(componentSource).toContain("rival-foul-minus");
    expect(componentSource).toContain("rival-foul-plus");
  });
});
