import { calculatePlayerValuation, useGameStore } from "../../store/GameStore";

describe("GameStore & Valuation Logic Unit Tests (T016)", () => {
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
