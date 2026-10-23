import {
  formatMatchShareData,
  formatShareImageFileName,
  sanitizeFileNamePart,
} from "../../utils/shareDataFormatter";
import { Game } from "../../../../types/database";
import { PeriodBreakdownItem, PlayerRosterItem, AdvancedTeamStats } from "../../types";

describe("shareDataFormatter Unit Tests (T007 - US1)", () => {
  const mockMatch: Game = {
    id: 1,
    teamId: 10,
    opponent: "CB Prat",
    round: "Jornada 7",
    date: "23/10/2026 - 20:00",
    status: "finished",
    createdAt: "2026-10-23T10:00:00.000Z",
    resultC1: 20,
    resultC2: 15,
    resultC3: 25,
    resultC4: 20,
    resultExtra: 0,
    resultC1Opponent: 18,
    resultC2Opponent: 12,
    resultC3Opponent: 20,
    resultC4Opponent: 22,
    resultExtraOpponent: 0,
    foulsC1: 4,
    foulsC2: 3,
    foulsC3: 5,
    foulsC4: 4,
    foulsExtra: 0,
    foulsC1Opponent: 3,
    foulsC2Opponent: 4,
    foulsC3Opponent: 2,
    foulsC4Opponent: 5,
    foulsExtraOpponent: 0,
  };

  const mockPeriods: PeriodBreakdownItem[] = [
    { id: "q1", label: "Period 1", teamPoints: 20, teamFouls: 4, rivalPoints: 18, rivalFouls: 3, isExtra: false },
    { id: "q2", label: "Period 2", teamPoints: 15, teamFouls: 3, rivalPoints: 12, rivalFouls: 4, isExtra: false },
    { id: "q3", label: "Period 3", teamPoints: 25, teamFouls: 5, rivalPoints: 20, rivalFouls: 2, isExtra: false },
    { id: "q4", label: "Period 4", teamPoints: 20, teamFouls: 4, rivalPoints: 22, rivalFouls: 5, isExtra: false },
  ];

  const mockPlayers: PlayerRosterItem[] = [
    {
      id: 1,
      statId: 101,
      jerseyNumber: "4",
      firstName: "Marc",
      lastName: "Gasol",
      fullName: "Marc Gasol",
      minutes: 25,
      points: 15,
      valuation: 20,
      t1a: 3,
      t1i: 4,
      t2a: 3,
      t2i: 6,
      t3a: 2,
      t3i: 4,
      oreb: 2,
      dreb: 6,
      totalRebounds: 8,
      asis: 4,
      rec: 1,
      per: 2,
      falt: 3,
    },
    {
      id: 2,
      statId: 102,
      jerseyNumber: "9",
      firstName: "Ricky",
      lastName: "Rubio",
      fullName: "Ricky Rubio",
      minutes: 20,
      points: 8,
      valuation: 14,
      t1a: 2,
      t1i: 2,
      t2a: 0,
      t2i: 0, // Zero attempts test
      t3a: 2,
      t3i: 5,
      oreb: 0,
      dreb: 3,
      totalRebounds: 3,
      asis: 7,
      rec: 3,
      per: 1,
      falt: 2,
    },
  ];

  const mockAdvancedStats: AdvancedTeamStats = {
    posesiones: 72.4,
    oer: 110.5,
    der: 99.4,
    efg: 52.3,
    orb: 28.6,
    ast: 65.0,
    tov: 14.2,
    ftr: 22.8,
  };

  it("should format match header metadata correctly", () => {
    const result = formatMatchShareData({
      match: mockMatch,
      teamName: "CB Salliver",
      periods: mockPeriods,
      players: mockPlayers,
      advancedStats: mockAdvancedStats,
    });

    expect(result.homeTeamName).toBe("CB Salliver");
    expect(result.rivalTeamName).toBe("CB Prat");
    expect(result.roundAndDate).toBe("Jornada 7 - 23/10/2026 - 20:00");
  });

  it("should format all 24 player columns with safe percentage formatting", () => {
    const result = formatMatchShareData({
      match: mockMatch,
      teamName: "CB Salliver",
      periods: mockPeriods,
      players: mockPlayers,
      advancedStats: mockAdvancedStats,
    });

    expect(result.players).toHaveLength(2);

    const marc = result.players[0];
    expect(marc.jerseyNumber).toBe("4");
    expect(marc.playerName).toBe("Marc Gasol");
    expect(marc.minutes).toBe(25);
    expect(marc.pts).toBe(15);
    expect(marc.t2a).toBe(3);
    expect(marc.t2i).toBe(6);
    expect(marc.t2p).toBe("50%");
    expect(marc.t3a).toBe(2);
    expect(marc.t3i).toBe(4);
    expect(marc.t3p).toBe("50%");
    expect(marc.t1a).toBe(3);
    expect(marc.t1i).toBe(4);
    expect(marc.t1p).toBe("75%");
    expect(marc.dreb).toBe(6);
    expect(marc.oreb).toBe(2);
    expect(marc.treb).toBe(8);
    expect(marc.asis).toBe(4);
    expect(marc.rec).toBe(1);
    expect(marc.per).toBe(2);
    expect(marc.tapF).toBe(0);
    expect(marc.tapC).toBe(0);
    expect(marc.falt).toBe(3);
    expect(marc.faltR).toBe(0);
    expect(marc.val).toBe(20);

    const ricky = result.players[1];
    // Zero attempts must safely format to 0%
    expect(ricky.t2i).toBe(0);
    expect(ricky.t2p).toBe("0%");
  });

  it("should calculate team totals (EQUIPO row) accurately", () => {
    const result = formatMatchShareData({
      match: mockMatch,
      teamName: "CB Salliver",
      periods: mockPeriods,
      players: mockPlayers,
      advancedStats: mockAdvancedStats,
    });

    const totals = result.totals;
    expect(totals.label).toBe("EQUIPO");
    expect(totals.minutes).toBe(45);
    expect(totals.pts).toBe(23);
    expect(totals.t2a).toBe(3);
    expect(totals.t2i).toBe(6);
    expect(totals.t2p).toBe("50%");
    expect(totals.t3a).toBe(4);
    expect(totals.t3i).toBe(9);
    expect(totals.t3p).toBe("44%"); // 4 / 9 * 100 = 44.44% -> 44%
    expect(totals.t1a).toBe(5);
    expect(totals.t1i).toBe(6);
    expect(totals.t1p).toBe("83%"); // 5 / 6 * 100 = 83.33% -> 83%
    expect(totals.dreb).toBe(9);
    expect(totals.oreb).toBe(2);
    expect(totals.treb).toBe(11);
    expect(totals.asis).toBe(11);
    expect(totals.rec).toBe(4);
    expect(totals.per).toBe(3);
    expect(totals.val).toBe(34);
  });

  it("should map period scores including C1-C4 and Final cumulative row", () => {
    const result = formatMatchShareData({
      match: mockMatch,
      teamName: "CB Salliver",
      periods: mockPeriods,
      players: mockPlayers,
      advancedStats: mockAdvancedStats,
    });

    expect(result.periods).toHaveLength(5);
    expect(result.periods[0]).toEqual({ period: "C1", homeScore: 20, rivalScore: 18 });
    expect(result.periods[1]).toEqual({ period: "C2", homeScore: 15, rivalScore: 12 });
    expect(result.periods[2]).toEqual({ period: "C3", homeScore: 25, rivalScore: 20 });
    expect(result.periods[3]).toEqual({ period: "C4", homeScore: 20, rivalScore: 22 });
    expect(result.periods[4]).toEqual({ period: "Final", homeScore: 80, rivalScore: 72 });
  });

  it("should format advanced metrics with fallback protection against NaN or division by zero", () => {
    const emptyAdvanced: AdvancedTeamStats = {
      posesiones: 0,
      oer: 0,
      der: 0,
      efg: 0,
      orb: 0,
      ast: 0,
      tov: 0,
      ftr: 0,
    };

    const result = formatMatchShareData({
      match: mockMatch,
      teamName: "CB Salliver",
      periods: mockPeriods,
      players: [],
      advancedStats: emptyAdvanced,
    });

    expect(result.advancedStats.posesiones).toBe("0.0");
    expect(result.advancedStats.oer).toBe("0.0");
    expect(result.advancedStats.der).toBe("0.0");
    expect(result.advancedStats.efg).toBe("0.0%");
    expect(result.advancedStats.orb).toBe("0.0%");
    expect(result.advancedStats.ast).toBe("0.0%");
    expect(result.advancedStats.tov).toBe("0.0%");
    expect(result.advancedStats.tlr).toBe("0.0%");
  });

  describe("formatShareImageFileName and sanitizeFileNamePart", () => {
    it("should format filename with rival team and round string", () => {
      const fileName = formatShareImageFileName("CB Granollers", "Jornada 4");
      expect(fileName).toBe("CB_Granollers_Jornada_4.png");
    });

    it("should format filename with numeric round by prefixing with Jornada_", () => {
      expect(formatShareImageFileName("CB Prat", 7)).toBe("CB_Prat_Jornada_7.png");
      expect(formatShareImageFileName("CB Prat", "7")).toBe("CB_Prat_Jornada_7.png");
    });

    it("should sanitize illegal filesystem characters from rival team and round", () => {
      const fileName = formatShareImageFileName('CB/Granollers: "Jr." *A*', "Jornada? <4>");
      expect(fileName).toBe("CBGranollers_Jr._A_Jornada_4.png");
      expect(fileName).not.toMatch(/[\\/:*?"<>|]/);
    });

    it("should collapse multiple whitespace and underscores", () => {
      const fileName = formatShareImageFileName("  Real   Madrid   Baloncesto  ", "  Jornada   10  ");
      expect(fileName).toBe("Real_Madrid_Baloncesto_Jornada_10.png");
    });

    it("should fallback to Rival when opponent is empty or null", () => {
      expect(formatShareImageFileName("", "Jornada 2")).toBe("Rival_Jornada_2.png");
      expect(formatShareImageFileName(null, "Jornada 2")).toBe("Rival_Jornada_2.png");
      expect(formatShareImageFileName(undefined, 3)).toBe("Rival_Jornada_3.png");
    });

    it("should handle custom non-numeric round labels like Playoff or Final", () => {
      expect(formatShareImageFileName("Unicaja", "Playoff Semifinal")).toBe("Unicaja_Playoff_Semifinal.png");
    });

    it("should produce a clean filename when round is undefined or empty", () => {
      expect(formatShareImageFileName("CB Salliver", undefined)).toBe("CB_Salliver.png");
      expect(formatShareImageFileName("CB Salliver", "")).toBe("CB_Salliver.png");
      expect(formatShareImageFileName(null, null)).toBe("Rival.png");
    });

    it("sanitizeFileNamePart should strip forbidden characters and trim", () => {
      expect(sanitizeFileNamePart("   hello/world:test*   ")).toBe("helloworldtest");
      expect(sanitizeFileNamePart(null)).toBe("");
      expect(sanitizeFileNamePart(undefined)).toBe("");
    });
  });
});
