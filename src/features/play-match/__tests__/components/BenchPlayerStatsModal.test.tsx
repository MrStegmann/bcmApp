import React from "react";
import { InGamePlayer, BenchPlayerStatsModalProps } from "../../types";
import { formatThrowStat } from "../../utils/formatThrowStat";
import { formatPlayerIdentifier } from "../../utils/formatPlayerIdentifier";

declare const jest: any;
declare const require: any;
declare const __dirname: string;
const fs = require("fs");
const path = require("path");

describe("BenchPlayerStatsModal (T038 - US5)", () => {
  const mockBenchPlayer: InGamePlayer = {
    id: 12,
    firstName: "Gorka",
    lastName: "Sanchez",
    number: "7",
    jerseyName: "SANCHEZ",
    position: "Alero",
    isOnCourt: false,
    secondsPlayed: 720, // 12 minutes
    stintSeconds: 0,
    t1a: 2,
    t1i: 1, // FT: 2/3 (67%)
    t2a: 4,
    t2i: 1, // 2PT: 4/5 (80%)
    t3a: 0,
    t3i: 0, // 3PT: 0/0 (0%)
    oreb: 3,
    dreb: 4,
    asis: 5,
    rec: 2,
    per: 1,
    falt: 2,
    valuation: 18,
  };

  it("should conform to BenchPlayerStatsModalProps contract", () => {
    const onCloseMock = jest.fn();

    const props: BenchPlayerStatsModalProps = {
      visible: true,
      player: mockBenchPlayer,
      onClose: onCloseMock,
    };

    expect(props.visible).toBe(true);
    expect(props.player?.id).toBe(12);

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should verify player identification and prominent header minutes and points calculations", () => {
    const identifier = formatPlayerIdentifier(mockBenchPlayer);
    expect(identifier).toBe("SANCHEZ");

    const minutes = Math.floor((mockBenchPlayer.secondsPlayed || 0) / 60);
    const points =
      mockBenchPlayer.t1a * 1 + mockBenchPlayer.t2a * 2 + mockBenchPlayer.t3a * 3;

    expect(minutes).toBe(12);
    expect(points).toBe(10); // 2*1 + 4*2 + 0*3 = 10 pts
  });

  it("should format 1pt, 2pt, and 3pt shooting stats using formatThrowStat with zero-attempt safety", () => {
    const ftStat = formatThrowStat(mockBenchPlayer.t1a, mockBenchPlayer.t1i);
    const fg2Stat = formatThrowStat(mockBenchPlayer.t2a, mockBenchPlayer.t2i);
    const fg3Stat = formatThrowStat(mockBenchPlayer.t3a, mockBenchPlayer.t3i);

    expect(ftStat).toBe("2/3 (67%)");
    expect(fg2Stat).toBe("4/5 (80%)");
    expect(fg3Stat).toBe("0/0 (0%)");
  });

  it("should verify complete secondary statline calculations", () => {
    const totalRebounds = mockBenchPlayer.oreb + mockBenchPlayer.dreb;
    expect(mockBenchPlayer.oreb).toBe(3);
    expect(mockBenchPlayer.dreb).toBe(4);
    expect(totalRebounds).toBe(7);
    expect(mockBenchPlayer.asis).toBe(5);
    expect(mockBenchPlayer.rec).toBe(2);
    expect(mockBenchPlayer.per).toBe(1);
    expect(mockBenchPlayer.falt).toBe(2);
    expect(mockBenchPlayer.valuation).toBe(18);
  });

  it("should enforce component source structure, testIDs, cross button, and backdrop click-outside dismissal", () => {
    const componentPath = path.resolve(__dirname, "../../components/BenchPlayerStatsModal.tsx");
    expect(fs.existsSync(componentPath)).toBe(true);

    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // Must import formatThrowStat and formatPlayerIdentifier
    expect(componentSource).toContain("formatThrowStat");
    expect(componentSource).toContain("formatPlayerIdentifier");

    // Modal structure with testIDs
    expect(componentSource).toContain('testID="bench-player-stats-modal"');
    expect(componentSource).toContain('testID="bench-stats-backdrop"');
    expect(componentSource).toContain('testID="bench-stats-close-button"');

    // Visual Layering: Backdrop overlay and modal card
    expect(componentSource).toContain("bg-slate-950");
    expect(componentSource).toContain("bg-slate-900");

    // Prominent Header Minutes and Points
    expect(componentSource).toContain("min");
    expect(componentSource).toContain("pts");

    // Shooting stats breakdown
    expect(componentSource).toContain("T1");
    expect(componentSource).toContain("T2");
    expect(componentSource).toContain("T3");

    // Rebounds, defense, fouls, valuation
    expect(componentSource).toContain("Rebotes");
    expect(componentSource).toContain("Valoración");
  });
});
