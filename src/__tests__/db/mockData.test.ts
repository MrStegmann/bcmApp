import { MOCK_TEAM_DATA } from "../../db/mock/mockTeamData";
import { BasketballPosition } from "../../types/mockData";

describe("Mock Team Dataset Unit Tests", () => {
  describe("User Story 1 - Team Setup & Roster", () => {
    it("should define the correct team metadata", () => {
      expect(MOCK_TEAM_DATA).toBeDefined();
      expect(MOCK_TEAM_DATA.name).toBe("Club Baloncesto Alborán");
      expect(MOCK_TEAM_DATA.category).toBe("Cadete Oro");
    });

    it("should contain at least 12 players in the roster", () => {
      expect(Array.isArray(MOCK_TEAM_DATA.players)).toBe(true);
      expect(MOCK_TEAM_DATA.players.length).toBeGreaterThanOrEqual(12);
    });

    it("should ensure all player numbers are unique", () => {
      const numbers = MOCK_TEAM_DATA.players.map((p) => p.number);
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBe(numbers.length);
    });

    it("should ensure all players have valid names, numbers, and optional jerseyName", () => {
      MOCK_TEAM_DATA.players.forEach((p) => {
        expect(p.firstName.trim().length).toBeGreaterThan(0);
        expect(p.lastName.trim().length).toBeGreaterThan(0);
        expect(p.number.trim().length).toBeGreaterThan(0);
        if (p.jerseyName !== undefined) {
          expect(typeof p.jerseyName).toBe("string");
        }
      });
    });
  });

  describe("User Story 2 - Complete 10-Match Schedule", () => {
    const TIMESTAMP_REGEX = /^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/;

    it("should define exactly 10 games in the schedule", () => {
      expect(Array.isArray(MOCK_TEAM_DATA.games)).toBe(true);
      expect(MOCK_TEAM_DATA.games.length).toBe(10);
    });

    it("should contain exactly 5 finished and 5 pending games", () => {
      const finished = MOCK_TEAM_DATA.games.filter((g) => g.status === "finished");
      const pending = MOCK_TEAM_DATA.games.filter((g) => g.status === "pending");
      expect(finished.length).toBe(5);
      expect(pending.length).toBe(5);
    });

    it("should have valid dates formatted as DD/MM/YYYY - HH:MM for all games", () => {
      MOCK_TEAM_DATA.games.forEach((game) => {
        expect(TIMESTAMP_REGEX.test(game.date)).toBe(true);
      });
    });

    it("should ensure finished games have recorded quarter scores and pending games have zero scores", () => {
      const finished = MOCK_TEAM_DATA.games.filter((g) => g.status === "finished");
      const pending = MOCK_TEAM_DATA.games.filter((g) => g.status === "pending");

      finished.forEach((g) => {
        const teamTotal =
          (g.resultC1 || 0) +
          (g.resultC2 || 0) +
          (g.resultC3 || 0) +
          (g.resultC4 || 0) +
          (g.resultExtra || 0);
        expect(teamTotal).toBeGreaterThan(0);
      });

      pending.forEach((g) => {
        expect(g.resultC1 || 0).toBe(0);
        expect(g.resultC2 || 0).toBe(0);
        expect(g.resultC3 || 0).toBe(0);
        expect(g.resultC4 || 0).toBe(0);
        expect(g.resultExtra || 0).toBe(0);
      });
    });

    it("should include exactly 1 finished game with overtime that was tied at the end of regulation", () => {
      const finished = MOCK_TEAM_DATA.games.filter((g) => g.status === "finished");
      const otGames = finished.filter((g) => (g.resultExtra || 0) > 0 || (g.resultExtraOpponent || 0) > 0);
      expect(otGames.length).toBe(1);

      const otGame = otGames[0];
      const regTeam = (otGame.resultC1 || 0) + (otGame.resultC2 || 0) + (otGame.resultC3 || 0) + (otGame.resultC4 || 0);
      const regOpp = (otGame.resultC1Opponent || 0) + (otGame.resultC2Opponent || 0) + (otGame.resultC3Opponent || 0) + (otGame.resultC4Opponent || 0);
      expect(regTeam).toBe(regOpp);
    });
  });

  describe("User Story 3 - Player Box Scores & Reconciliation", () => {
    const finishedGames = MOCK_TEAM_DATA.games.filter((g) => g.status === "finished");

    it("should provide exactly 12 player stat records for every finished game (60 total)", () => {
      let totalStats = 0;
      finishedGames.forEach((game) => {
        expect(Array.isArray(game.playerStats)).toBe(true);
        expect(game.playerStats!.length).toBe(12);
        totalStats += game.playerStats!.length;
      });
      expect(totalStats).toBe(60);
    });

    it("should ensure every player stat references a valid roster player number", () => {
      const rosterNumbers = new Set(MOCK_TEAM_DATA.players.map((p) => p.number));
      finishedGames.forEach((game) => {
        game.playerStats!.forEach((stat) => {
          expect(rosterNumbers.has(stat.playerNumber)).toBe(true);
        });
      });
    });

    it("should reconcile player points exactly to match total team score for each finished game", () => {
      finishedGames.forEach((game) => {
        const teamScore =
          (game.resultC1 || 0) +
          (game.resultC2 || 0) +
          (game.resultC3 || 0) +
          (game.resultC4 || 0) +
          (game.resultExtra || 0);

        const sumPoints = game.playerStats!.reduce((acc, stat) => {
          return acc + stat.t1a * 1 + stat.t2a * 2 + stat.t3a * 3;
        }, 0);

        expect(sumPoints).toBe(teamScore);
      });
    });

    it("should enforce shot feasibility, foul limits, and DNP zeroes", () => {
      finishedGames.forEach((game) => {
        game.playerStats!.forEach((stat) => {
          expect(stat.t1a).toBeLessThanOrEqual(stat.t1i);
          expect(stat.t2a).toBeLessThanOrEqual(stat.t2i);
          expect(stat.t3a).toBeLessThanOrEqual(stat.t3i);
          expect(stat.falt).toBeLessThanOrEqual(5);

          if (stat.minutes === 0) {
            expect(stat.t1a).toBe(0);
            expect(stat.t1i).toBe(0);
            expect(stat.t2a).toBe(0);
            expect(stat.t2i).toBe(0);
            expect(stat.t3a).toBe(0);
            expect(stat.t3i).toBe(0);
            expect(stat.oreb).toBe(0);
            expect(stat.dreb).toBe(0);
            expect(stat.asis).toBe(0);
            expect(stat.rec).toBe(0);
            expect(stat.per).toBe(0);
            expect(stat.falt).toBe(0);
            expect(stat.valuation).toBe(0);
          }
        });
      });
    });

    it("should match calculatePlayerValuation formula for all player stat records", () => {
      finishedGames.forEach((game) => {
        game.playerStats!.forEach((stat) => {
          const made = stat.t1a + stat.t2a + stat.t3a;
          const missedT1 = Math.max(0, stat.t1i - stat.t1a);
          const missedT2 = Math.max(0, stat.t2i - stat.t2a);
          const missedT3 = Math.max(0, stat.t3i - stat.t3a);
          const expectedVal =
            made +
            stat.oreb +
            stat.dreb +
            stat.asis +
            stat.rec -
            stat.per -
            stat.falt -
            missedT1 -
            missedT2 -
            missedT3;

          expect(stat.valuation).toBe(expectedVal);
        });
      });
    });
  });
});


