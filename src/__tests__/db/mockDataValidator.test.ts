import { validateDataset } from "../../db/mock/mockDataValidator";
import { MockTeamDatasetConfig } from "../../types/mockData";

describe("mockDataValidator", () => {
  const createValidDataset = (): MockTeamDatasetConfig => ({
    name: "CB Salliver",
    category: "Junior Celeste",
    players: [
      { firstName: "P1", lastName: "L1", number: "1", position: "Point Guard" },
      { firstName: "P2", lastName: "L2", number: "2", position: "Shooting Guard" },
      { firstName: "P3", lastName: "L3", number: "3", position: "Small Forward" },
      { firstName: "P4", lastName: "L4", number: "4", position: "Power Forward" },
      { firstName: "P5", lastName: "L5", number: "5", position: "Center" },
      { firstName: "P6", lastName: "L6", number: "6", position: "Base" },
      { firstName: "P7", lastName: "L7", number: "7", position: "Escolta" },
      { firstName: "P8", lastName: "L8", number: "8", position: "Alero" },
      { firstName: "P9", lastName: "L9", number: "9", position: "Ala-P\u00edvot" },
      { firstName: "P10", lastName: "L10", number: "10", position: "P\u00edvot" },
      { firstName: "P11", lastName: "L11", number: "11", position: "Point Guard" },
      { firstName: "P12", lastName: "L12", number: "12", position: "Center" },
    ],
    games: [
      // 5 finished games
      ...Array.from({ length: 5 }, (_, i) => ({
        opponent: `Opponent ${i + 1}`,
        round: `${i + 1}`,
        date: "12/01/2026 - 18:00",
        status: "finished" as const,
        resultC1: 15,
        resultC2: 15,
        resultC3: 15,
        resultC4: 15,
        resultExtra: 0,
        resultC1Opponent: 12,
        resultC2Opponent: 12,
        resultC3Opponent: 12,
        resultC4Opponent: 12,
        resultExtraOpponent: 0,
        foulsC1: 3,
        foulsC2: 3,
        foulsC3: 3,
        foulsC4: 3,
        foulsExtra: 0,
        playerStats: [
          // 60 total points = 12 players * 5 points each (e.g. 1*t1a=1, 2*t2a=4 -> 5 points)
          ...Array.from({ length: 12 }, (_, pIdx) => ({
            playerNumber: `${pIdx + 1}`,
            minutes: 15,
            t1a: 1,
            t1i: 1,
            t2a: 2,
            t2i: 2,
            t3a: 0,
            t3i: 0,
            oreb: 1,
            dreb: 2,
            asis: 1,
            rec: 1,
            per: 1,
            falt: 2,
            // valuation: madeShots(3) + oreb(1) + dreb(2) + asis(1) + rec(1) - per(1) - falt(2) - missed(0) = 5
            valuation: 5,
          })),
        ],
      })),
      // 5 pending games
      ...Array.from({ length: 5 }, (_, i) => ({
        opponent: `Opponent ${i + 6}`,
        round: `${i + 6}`,
        date: "20/03/2026 - 18:00",
        status: "pending" as const,
        resultC1: 0,
        resultC2: 0,
        resultC3: 0,
        resultC4: 0,
        resultExtra: 0,
        resultC1Opponent: 0,
        resultC2Opponent: 0,
        resultC3Opponent: 0,
        resultC4Opponent: 0,
        resultExtraOpponent: 0,
        foulsC1: 0,
        foulsC2: 0,
        foulsC3: 0,
        foulsC4: 0,
        foulsExtra: 0,
      })),
    ],
  });

  it("passes validation for a valid dataset", () => {
    const dataset = createValidDataset();
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("fails if roster has fewer than 12 players", () => {
    const dataset = createValidDataset();
    dataset.players.pop();
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("fewer than 12"))).toBe(true);
  });

  it("fails if roster contains duplicate jersey numbers", () => {
    const dataset = createValidDataset();
    dataset.players[1].number = dataset.players[0].number;
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("duplicate jersey number"))).toBe(true);
  });

  it("fails if match count is not exactly 10 or finished/pending count is not 5 each", () => {
    const dataset = createValidDataset();
    dataset.games.pop(); // 9 matches
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("10 matches"))).toBe(true);
  });

  it("fails if date format does not match DD/MM/YYYY - HH:MM", () => {
    const dataset = createValidDataset();
    dataset.games[0].date = "2026-01-12 18:00";
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("date format"))).toBe(true);
  });

  it("fails if player box score points do not reconcile with game total points", () => {
    const dataset = createValidDataset();
    // change player's t1a without changing game total
    dataset.games[0].playerStats![0].t1a = 3;
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("points reconciliation"))).toBe(true);
  });

  it("fails if shot attempts are less than made shots", () => {
    const dataset = createValidDataset();
    dataset.games[0].playerStats![0].t2a = 5;
    dataset.games[0].playerStats![0].t2i = 2; // attempts < made
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("attempt"))).toBe(true);
  });

  it("fails if DNP player (0 minutes) has non-zero stats", () => {
    const dataset = createValidDataset();
    dataset.games[0].playerStats![0].minutes = 0;
    // but t1a, t2a, etc. are non-zero
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("DNP"))).toBe(true);
  });

  it("fails if player valuation does not match calculatePlayerValuation formula", () => {
    const dataset = createValidDataset();
    dataset.games[0].playerStats![0].valuation = 999;
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("valuation"))).toBe(true);
  });

  it("fails if playerStats references a player number not in roster", () => {
    const dataset = createValidDataset();
    dataset.games[0].playerStats![0].playerNumber = "99";
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("not found in team roster"))).toBe(true);
  });

  it("fails if finished game has overtime but regular quarters are not tied", () => {
    const dataset = createValidDataset();
    dataset.games[0].resultExtra = 5;
    // regular quarters are 60 vs 48 (not tied)
    const result = validateDataset(dataset);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("overtime"))).toBe(true);
  });
});
