import { matchCacheService } from "../services/matchCacheService";
import { matchCacheRepository } from "../db/matchCacheRepository";
import { usePlayMatchStore, resetPlayMatchStore } from "../store/usePlayMatchStore";

jest.mock("../db/matchCacheRepository", () => ({
  matchCacheRepository: {
    getCache: jest.fn(),
    saveCache: jest.fn(),
    removeCache: jest.fn(),
  },
}));

describe("PlayMatch Cache Recovery & Corruption Integration (T025)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPlayMatchStore();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it("safely recovers from corrupted JSON cache, purges damaged record, and allows fresh match start", async () => {
    // 1. Mock corrupted JSON in repository
    (matchCacheRepository.getCache as jest.Mock).mockResolvedValue({
      id: 1,
      matchId: 99,
      stateJson: "{{corrupted--invalid-json",
      version: 1,
      lastUpdated: new Date().toISOString(),
    });

    // 2. Load session should not throw
    const loaded = await matchCacheService.loadSession(99);

    // 3. Verifications
    expect(loaded).toBeNull();
    expect(matchCacheRepository.removeCache).toHaveBeenCalledWith(99);
    expect(console.warn).toHaveBeenCalled();

    // 4. Initialize fresh store without crashing
    usePlayMatchStore.getState().initMatch(99, [
      {
        id: 1,
        firstName: "Fresh",
        lastName: "Player",
        number: "10",
        isOnCourt: false,
        secondsPlayed: 0,
        stintSeconds: 0,
        t1a: 0,
        t1i: 0,
        t2a: 0,
        t2i: 0,
        t3a: 0,
        t3i: 0,
        oreb: 0,
        dreb: 0,
        asis: 0,
        rec: 0,
        per: 0,
        falt: 0,
        valuation: 0,
      },
    ]);

    expect(usePlayMatchStore.getState().matchId).toBe(99);
    expect(usePlayMatchStore.getState().players).toHaveLength(1);
    expect(usePlayMatchStore.getState().activePeriod).toBe("q1");
  });
});
