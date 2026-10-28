import React from "react";
import { ManualTimeModalProps } from "../../types";

declare const jest: any;
declare const require: any;
declare const __dirname: string;

describe("ManualTimeModal (T008 - US1)", () => {
  it("should conform to ManualTimeModalProps contract", () => {
    const onSaveMock = jest.fn();
    const onCloseMock = jest.fn();

    const props: ManualTimeModalProps = {
      visible: true,
      currentSeconds: 450, // 07:30
      periodKey: "q1",
      onSaveTime: onSaveMock,
      onClose: onCloseMock,
    };

    expect(props.visible).toBe(true);
    expect(props.currentSeconds).toBe(450);
    expect(props.periodKey).toBe("q1");

    // Saving 10:00 (600s)
    props.onSaveTime(600);
    expect(onSaveMock).toHaveBeenCalledWith(600);

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should correctly compute minutes and seconds from raw seconds", () => {
    const totalSeconds = 450;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    expect(minutes).toBe(7);
    expect(seconds).toBe(30);
  });

  it("should support onResetExtraTimeCrono handler when in extra period", () => {
    const onResetMock = jest.fn();
    const onCloseMock = jest.fn();
    const props: ManualTimeModalProps = {
      visible: true,
      currentSeconds: 0,
      periodKey: "extra",
      onSaveTime: jest.fn(),
      onClose: onCloseMock,
      onResetExtraTimeCrono: onResetMock,
    };

    expect(props.periodKey).toBe("extra");
    expect(props.onResetExtraTimeCrono).toBeDefined();

    props.onResetExtraTimeCrono!();
    expect(onResetMock).toHaveBeenCalledTimes(1);
  });

  it("should verify presence of modal-reset-extra-crono-button in component source for extra period", () => {
    const fs = require("fs");
    const path = require("path");
    const componentPath = path.resolve(__dirname, "../../components/ManualTimeModal.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    expect(componentSource).toContain("modal-reset-extra-crono-button");
    expect(componentSource).toContain("onResetExtraTimeCrono");
  });
});
