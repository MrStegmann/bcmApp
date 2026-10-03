import React from "react";
import { RivalPanelControlProps } from "../../types";

declare const jest: any;

describe("RivalPanelControl (T022 - US4 Component 3)", () => {
  it("should conform to RivalPanelControlProps contract", () => {
    const onAdjustScoreMock = jest.fn();
    const onAdjustFoulsMock = jest.fn();

    const props: RivalPanelControlProps = {
      activePeriod: "q1",
      rivalPeriodScore: 12,
      rivalPeriodFouls: 2,
      totalRivalScore: 38,
      onAdjustRivalScore: onAdjustScoreMock,
      onAdjustRivalFouls: onAdjustFoulsMock,
    };

    expect(props.activePeriod).toBe("q1");
    expect(props.rivalPeriodScore).toBe(12);
    expect(props.rivalPeriodFouls).toBe(2);
    expect(props.totalRivalScore).toBe(38);

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
});
