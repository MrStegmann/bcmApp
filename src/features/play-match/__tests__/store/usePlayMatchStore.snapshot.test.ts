import { usePlayMatchStore } from "../../store/usePlayMatchStore";
import { InGamePlayer } from "../../types";

describe("usePlayMatchStore exportSnapshot (T009)", () => {
  const dummyPlayer: InGamePlayer = {
    id: 101,
    firstName: "Luka",
    lastName: "Doncic",
    number: "77",
    isOnCourt: true,
    courtPositionIndex: 0,
    secondsPlayed: 60,
    stintSeconds: 60,
    t1a: 0,
    t1i: 0,
    t2a: 2,
    t2i: 0,
    t3a: 1,
    t3i: 1,
    oreb: 0,
    dreb: 2,
    asis: 3,
    rec: 1,
    per: 1,
    falt: 0,
    valuation: 9,
  };

  beforeEach(() => {
    usePlayMatchStore.getState().initMatch(55, [dummyPlayer], [101]);
  });

  it("exports a complete, deep-cloned snapshot of the current match state", () => {
    // Modify period time and score
    usePlayMatchStore.getState().adjustRivalScore(5);
    usePlayMatchStore.getState().setPeriodTime("q1", 450);

    const snapshot = usePlayMatchStore.getState().exportSnapshot();

    expect(snapshot.version).toBe(1);
    expect(snapshot.matchId).toBe(55);
    expect(snapshot.activePeriod).toBe("q1");
    expect(snapshot.periods.q1.remainingSeconds).toBe(450);
    expect(snapshot.periods.q1.rivalScore).toBe(5);
    expect(snapshot.players).toHaveLength(1);
    expect(snapshot.players[0].id).toBe(101);
    expect(snapshot.timeouts.firstHalfRemaining).toBe(2);
    expect(snapshot.swap.isSwapMode).toBe(false);
    expect(Array.isArray(snapshot.scoreEvents)).toBe(true);
    expect(typeof snapshot.savedAt).toBe("string");
    expect(Number.isNaN(new Date(snapshot.savedAt).getTime())).toBe(false);

    // Verify deep copy (modifying exported object does not mutate store)
    snapshot.players[0].firstName = "Modified";
    expect(usePlayMatchStore.getState().players[0].firstName).toBe("Luka");
  });
});
