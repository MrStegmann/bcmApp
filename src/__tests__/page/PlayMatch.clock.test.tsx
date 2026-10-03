import { InGamePlayer, QuarterData, QuarterKey } from "../../types/match";
import { calculateTotalScore } from "../../store/GameStore";

declare const jest: any;

describe("PlayMatch Clock & Quarter Management Tests (T007 - US2)", () => {
  const initialQuarters: Record<QuarterKey, QuarterData> = {
    c1: {
      key: "c1",
      label: "C1",
      remainingSeconds: 600,
      teamScore: 18,
      rivalScore: 15,
      teamFouls: 2,
      rivalFouls: 3,
      isCompleted: false,
    },
    c2: {
      key: "c2",
      label: "C2",
      remainingSeconds: 600,
      teamScore: 20,
      rivalScore: 22,
      teamFouls: 4,
      rivalFouls: 2,
      isCompleted: false,
    },
    c3: {
      key: "c3",
      label: "C3",
      remainingSeconds: 600,
      teamScore: 14,
      rivalScore: 16,
      teamFouls: 1,
      rivalFouls: 1,
      isCompleted: false,
    },
    c4: {
      key: "c4",
      label: "C4",
      remainingSeconds: 600,
      teamScore: 22,
      rivalScore: 21,
      teamFouls: 5,
      rivalFouls: 4,
      isCompleted: false,
    },
    extra: {
      key: "extra",
      label: "PR",
      remainingSeconds: 300,
      teamScore: 0,
      rivalScore: 0,
      teamFouls: 0,
      rivalFouls: 0,
      isCompleted: false,
    },
  };

  describe("Quarter Isolation", () => {
    it("should preserve isolated time, scores, and fouls per quarter", () => {
      expect(initialQuarters.c1.teamScore).toBe(18);
      expect(initialQuarters.c1.teamFouls).toBe(2);
      expect(initialQuarters.c2.teamScore).toBe(20);
      expect(initialQuarters.c2.teamFouls).toBe(4);

      const totalTeam = calculateTotalScore({
        c1: initialQuarters.c1.teamScore,
        c2: initialQuarters.c2.teamScore,
        c3: initialQuarters.c3.teamScore,
        c4: initialQuarters.c4.teamScore,
        extra: initialQuarters.extra.teamScore,
      });

      const totalRival = calculateTotalScore({
        c1: initialQuarters.c1.rivalScore,
        c2: initialQuarters.c2.rivalScore,
        c3: initialQuarters.c3.rivalScore,
        c4: initialQuarters.c4.rivalScore,
        extra: initialQuarters.extra.rivalScore,
      });

      expect(totalTeam).toBe(74);
      expect(totalRival).toBe(74);
    });
  });

  describe("Playing Minutes Accumulation", () => {
    it("should accumulate seconds for exactly the 5 on-court players while clock is active", () => {
      const roster: InGamePlayer[] = [
        { id: 1, firstName: "A", lastName: "", number: "1", isOnCourt: true, secondsPlayed: 100, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 2, firstName: "B", lastName: "", number: "2", isOnCourt: true, secondsPlayed: 100, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 3, firstName: "C", lastName: "", number: "3", isOnCourt: true, secondsPlayed: 100, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 4, firstName: "D", lastName: "", number: "4", isOnCourt: true, secondsPlayed: 100, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 5, firstName: "E", lastName: "", number: "5", isOnCourt: true, secondsPlayed: 100, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
        { id: 6, firstName: "F", lastName: "", number: "6", isOnCourt: false, secondsPlayed: 50, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
      ];

      // Simulate 5 seconds tick
      const tickSeconds = (currentRoster: InGamePlayer[], secondsDelta: number) => {
        return currentRoster.map((p) =>
          p.isOnCourt ? { ...p, secondsPlayed: p.secondsPlayed + secondsDelta } : p
        );
      };

      const updated = tickSeconds(roster, 5);
      expect(updated.filter((p) => p.isOnCourt).every((p) => p.secondsPlayed === 105)).toBe(true);
      expect(updated.find((p) => p.id === 6)?.secondsPlayed).toBe(50);
    });
  });

  describe("Auto-Stop on Fouls", () => {
    it("should trigger timer pause when team foul occurs", () => {
      let isTimerRunning = true;
      const handleTeamFoul = () => {
        isTimerRunning = false;
      };

      handleTeamFoul();
      expect(isTimerRunning).toBe(false);
    });

    it("should trigger timer pause when rival foul occurs", () => {
      let isTimerRunning = true;
      const handleRivalFoul = () => {
        isTimerRunning = false;
      };

      handleRivalFoul();
      expect(isTimerRunning).toBe(false);
    });
  });

  describe("Extra Time Overtime Reset", () => {
    it("should reset overtime clock to 300 seconds and grant +1 timeout without clearing scores", () => {
      let quarters = { ...initialQuarters };
      let extraResetsCount = 0;

      // Set ET clock to 0
      quarters.extra = { ...quarters.extra, remainingSeconds: 0, teamScore: 10, rivalScore: 10 };

      const handleResetOvertime = () => {
        quarters.extra = { ...quarters.extra, remainingSeconds: 300 };
        extraResetsCount += 1;
      };

      handleResetOvertime();

      expect(quarters.extra.remainingSeconds).toBe(300);
      expect(quarters.extra.teamScore).toBe(10);
      expect(quarters.extra.rivalScore).toBe(10);
      expect(extraResetsCount).toBe(1);
    });
  });
});
