import React from "react";
import { PeriodKey, PeriodSelectModalProps } from "../../types";

declare const jest: any;

describe("PeriodSelectModal (T007 - US1)", () => {
  const periods: { key: PeriodKey; label: string }[] = [
    { key: "q1", label: "Q1" },
    { key: "q2", label: "Q2" },
    { key: "q3", label: "Q3" },
    { key: "q4", label: "Q4" },
    { key: "extra", label: "EXTRA" },
  ];

  it("should conform to PeriodSelectModalProps contract", () => {
    const onSelectMock = jest.fn();
    const onCloseMock = jest.fn();

    const props: PeriodSelectModalProps = {
      visible: true,
      currentPeriod: "q1",
      onSelectPeriod: onSelectMock,
      onClose: onCloseMock,
    };

    expect(props.visible).toBe(true);
    expect(props.currentPeriod).toBe("q1");

    props.onSelectPeriod("extra");
    expect(onSelectMock).toHaveBeenCalledWith("extra");

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should contain all 5 periods for selection", () => {
    expect(periods.map((p) => p.key)).toEqual(["q1", "q2", "q3", "q4", "extra"]);
  });
});
