import {
  calculatePlayerValuation,
  sortGamesByRecency,
  useGameStore,
} from "../../store/GameStore";
import { Game } from "../../types/database";

describe("GameStore & Valuation Logic Unit Tests (T005)", () => {
  describe("Player Valuation Calculation", () => {
    it("should calculate correct valuation for a player box score", () => {
      const stat = {
        id: 1,
        gameId: 1,
        playerId: 1,
        minutes: 20,
        t1a: 2, // 2 Made FT
        t1i: 3, // 3 Att FT (1 miss)
        t2a: 4, // 4 Made 2PT
        t2i: 6, // 6 Att 2PT (2 miss)
        t3a: 1, // 1 Made 3PT
        t3i: 2, // 2 Att 3PT (1 miss)
        oreb: 2,
        dreb: 3, // Total Reb = 5
        asis: 4,
        rec: 2,
        per: 1,
        falt: 2,
        valuation: 0,
      };

      // PTS = 2*1 + 4*2 + 1*3 = 13 pts
      // VAL = (t2a + t3a + t1a) + (oreb + dreb) + asis + rec - per - falt - (t2i-t2a) - (t3i-t3a) - (t1i-t1a)
      // VAL = (4 + 1 + 2) + 5 + 4 + 2 - 1 - 2 - 2 - 1 - 1 = 7 + 5 + 4 + 2 - 7 = 11
      const val = calculatePlayerValuation(stat);
      expect(val).toBe(11);
    });

    it("should handle empty or zero stats without throwing NaN", () => {
      const val = calculatePlayerValuation({});
      expect(val).toBe(0);
    });
  });

  describe("Match Sorting by Recency", () => {
    it("should sort matches with most recent timestamp/date first", () => {
      const gameOlder = {
        id: 1,
        teamId: 1,
        opponent: "Rival 1",
        round: "1",
        date: "10/10/2026 - 10:00",
        status: "pending",
        createdAt: "2026-10-01T10:00:00.000Z",
      } as Game;

      const gameNewer = {
        id: 2,
        teamId: 1,
        opponent: "Rival 2",
        round: "2",
        date: "20/10/2026 - 19:30",
        status: "pending",
        createdAt: "2026-10-02T10:00:00.000Z",
      } as Game;

      const gameMiddle = {
        id: 3,
        teamId: 1,
        opponent: "Rival 3",
        round: "3",
        date: "15/10/2026 - 12:00",
        status: "inProgress",
        createdAt: "2026-10-01T15:00:00.000Z",
      } as Game;

      const sorted = sortGamesByRecency([gameOlder, gameNewer, gameMiddle]);
      expect(sorted[0].id).toBe(2); // 20/10/2026
      expect(sorted[1].id).toBe(3); // 15/10/2026
      expect(sorted[2].id).toBe(1); // 10/10/2026
    });

    it("should fallback to createdAt if date formats cannot be parsed", () => {
      const game1 = {
        id: 1,
        teamId: 1,
        opponent: "Team A",
        round: "1",
        date: "Date A",
        status: "pending",
        createdAt: "2026-10-01T10:00:00.000Z",
      } as Game;

      const game2 = {
        id: 2,
        teamId: 1,
        opponent: "Team B",
        round: "2",
        date: "Date B",
        status: "pending",
        createdAt: "2026-10-02T10:00:00.000Z",
      } as Game;

      const sorted = sortGamesByRecency([game1, game2]);
      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(1);
    });
  });

  describe("Match State Machine Transitions", () => {
    it("should transition state from pending to inProgress on startMatch", async () => {
      const store = useGameStore.getState();
      const mockGame = {
        id: 100,
        teamId: 1,
        opponent: "Lakers",
        round: "Jornada 1",
        date: "15/10/2026 - 19:30",
        status: "pending",
        createdAt: new Date().toISOString(),
      } as Game;

      useGameStore.setState({
        gamesList: [mockGame],
        games: [mockGame],
        selectedGame: mockGame,
      });

      // Directly verify updateGame or startMatch logic
      await store.startMatch(100);

      const updated = useGameStore.getState().gamesList.find((g) => g.id === 100);
      expect(updated?.status).toBe("inProgress");
    });

    it("should transition state from inProgress to finished on finishMatch", async () => {
      const store = useGameStore.getState();
      const mockGame = {
        id: 101,
        teamId: 1,
        opponent: "Celtics",
        round: "Jornada 2",
        date: "16/10/2026 - 19:30",
        status: "inProgress",
        createdAt: new Date().toISOString(),
      } as Game;

      useGameStore.setState({
        gamesList: [mockGame],
        games: [mockGame],
        selectedGame: mockGame,
      });

      await store.finishMatch(101);

      const updated = useGameStore.getState().gamesList.find((g) => g.id === 101);
      expect(updated?.status).toBe("finished");
    });
  });
});
