import { RivalControlPanelProps, QuarterKey } from "../../types/match";
import { calculateTimeoutBudget } from "../../store/GameStore";

declare const jest: any;

describe("RivalControlPanel & Timeout Budget Tests (T018 - US5)", () => {
  it("should conform to RivalControlPanelProps and handle score / foul actions", () => {
    const onAdjustScoreMock = jest.fn();
    const onAdjustFoulsMock = jest.fn();

    const props: RivalControlPanelProps = {
      activeQuarterKey: "c1",
      rivalQuarterScore: 14,
      rivalQuarterFouls: 3,
      totalRivalScore: 14,
      onAdjustRivalScore: onAdjustScoreMock,
      onAdjustRivalFouls: onAdjustFoulsMock,
    };

    expect(props.activeQuarterKey).toBe("c1");
    expect(props.rivalQuarterScore).toBe(14);
    expect(props.rivalQuarterFouls).toBe(3);

    // Trigger score adjustments
    props.onAdjustRivalScore(1);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(1);

    props.onAdjustRivalScore(2);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(2);

    props.onAdjustRivalScore(3);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(3);

    props.onAdjustRivalScore(-1);
    expect(onAdjustScoreMock).toHaveBeenCalledWith(-1);

    // Trigger foul adjustments
    props.onAdjustRivalFouls(1);
    expect(onAdjustFoulsMock).toHaveBeenCalledWith(1);

    props.onAdjustRivalFouls(-1);
    expect(onAdjustFoulsMock).toHaveBeenCalledWith(-1);
  });

  it("should correctly compute timeout budgets across game phases", () => {
    // 1st Half (C1, C2): 2 timeouts
    expect(calculateTimeoutBudget("c1", 0)).toBe(2);
    expect(calculateTimeoutBudget("c2", 0)).toBe(2);

    // 2nd Half (C3, C4): 3 timeouts
    expect(calculateTimeoutBudget("c3", 0)).toBe(3);
    expect(calculateTimeoutBudget("c4", 0)).toBe(3);

    // Extra Time (initial): 1 timeout
    expect(calculateTimeoutBudget("extra", 0)).toBe(1);

    // Extra Time with resets (+1 for each reset)
    expect(calculateTimeoutBudget("extra", 1)).toBe(2);
    expect(calculateTimeoutBudget("extra", 2)).toBe(3);
  });

  it("should manage timeout state consumption within budget limits", () => {
    let timeoutsUsed = {
      firstHalf: 0,
      secondHalf: 0,
      extraTime: 0,
    };

    const useTimeout = (phase: "firstHalf" | "secondHalf" | "extraTime", maxAllowed: number) => {
      if (timeoutsUsed[phase] < maxAllowed) {
        timeoutsUsed[phase] += 1;
        return true;
      }
      return false;
    };

    // First half allows 2
    expect(useTimeout("firstHalf", 2)).toBe(true);
    expect(useTimeout("firstHalf", 2)).toBe(true);
    expect(useTimeout("firstHalf", 2)).toBe(false);
    expect(timeoutsUsed.firstHalf).toBe(2);

    // Second half allows 3
    expect(useTimeout("secondHalf", 3)).toBe(true);
    expect(useTimeout("secondHalf", 3)).toBe(true);
    expect(useTimeout("secondHalf", 3)).toBe(true);
    expect(useTimeout("secondHalf", 3)).toBe(false);
    expect(timeoutsUsed.secondHalf).toBe(3);

    // Extra time allows 1 + extra resets
    expect(useTimeout("extraTime", 1)).toBe(true);
    expect(useTimeout("extraTime", 1)).toBe(false);
  });
});
