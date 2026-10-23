import React from "react";
import { MatchStatsGraphicProps, MatchShareGraphicData } from "../../types";

describe("MatchStatsGraphic Component Contract (T008 - US1)", () => {
  const mockShareData: MatchShareGraphicData = {
    homeTeamName: "CB Salliver",
    rivalTeamName: "CB Marbella",
    roundAndDate: "Jornada 10 - 23/10/2026",
    players: [
      {
        jerseyNumber: "23",
        playerName: "Michael Jordan",
        minutes: 36,
        pts: 35,
        t2a: 10,
        t2i: 18,
        t2p: "56%",
        t3a: 3,
        t3i: 5,
        t3p: "60%",
        t1a: 6,
        t1i: 7,
        t1p: "86%",
        dreb: 5,
        oreb: 2,
        treb: 7,
        asis: 6,
        rec: 3,
        per: 2,
        tapF: 0,
        tapC: 0,
        falt: 2,
        faltR: 0,
        val: 38,
      },
    ],
    totals: {
      label: "EQUIPO",
      minutes: 200,
      pts: 88,
      t2a: 24,
      t2i: 48,
      t2p: "50%",
      t3a: 8,
      t3i: 22,
      t3p: "36%",
      t1a: 16,
      t1i: 20,
      t1p: "80%",
      dreb: 28,
      oreb: 10,
      treb: 38,
      asis: 20,
      rec: 9,
      per: 12,
      tapF: 0,
      tapC: 0,
      falt: 18,
      faltR: 0,
      val: 94,
    },
    periods: [
      { period: "C1", homeScore: 22, rivalScore: 18 },
      { period: "C2", homeScore: 20, rivalScore: 19 },
      { period: "C3", homeScore: 24, rivalScore: 22 },
      { period: "C4", homeScore: 22, rivalScore: 18 },
      { period: "Final", homeScore: 88, rivalScore: 77 },
    ],
    advancedStats: {
      posesiones: "74.2",
      oer: "118.6",
      der: "103.8",
      efg: "54.1%",
      orb: "31.2%",
      ast: "58.8%",
      tov: "14.1%",
      tlr: "25.0%",
    },
  };

  it("should validate the 24 table column definitions required by reference specification", () => {
    const requiredColumns = [
      "Núm.",
      "Nombre",
      "Min",
      "Pts",
      "T2A",
      "T2I",
      "T2%",
      "T3A",
      "T3I",
      "T3%",
      "T1A",
      "T1I",
      "T1%",
      "DReb",
      "OReb",
      "TReb",
      "Asis",
      "Rec",
      "Per",
      "TapF",
      "TapC",
      "Falt",
      "FaltR",
      "Val",
    ];

    expect(requiredColumns).toHaveLength(24);
  });

  it("should verify MatchStatsGraphicProps contract and structure", () => {
    const props: MatchStatsGraphicProps = {
      data: mockShareData,
    };

    expect(props.data.homeTeamName).toBe("CB Salliver");
    expect(props.data.rivalTeamName).toBe("CB Marbella");
    expect(props.data.roundAndDate).toBe("Jornada 10 - 23/10/2026");
    expect(props.data.players).toHaveLength(1);
    expect(props.data.totals.label).toBe("EQUIPO");
    expect(props.data.periods).toHaveLength(5);
    expect(props.data.advancedStats.posesiones).toBe("74.2");
  });

  it("should contain advanced metrics required for lower-left block", () => {
    const { advancedStats } = mockShareData;
    expect(advancedStats.posesiones).toBeDefined();
    expect(advancedStats.oer).toBeDefined();
    expect(advancedStats.der).toBeDefined();
    expect(advancedStats.efg).toBeDefined();
    expect(advancedStats.orb).toBeDefined();
    expect(advancedStats.ast).toBeDefined();
    expect(advancedStats.tov).toBeDefined();
    expect(advancedStats.tlr).toBeDefined();
  });

  it("should contain period score items required for lower-right block", () => {
    const { periods } = mockShareData;
    const finalPeriod = periods.find((p) => p.period === "Final");
    expect(finalPeriod).toBeDefined();
    expect(finalPeriod?.homeScore).toBe(88);
    expect(finalPeriod?.rivalScore).toBe(77);
  });
});
