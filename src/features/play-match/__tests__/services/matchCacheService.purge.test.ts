import { matchCacheService } from "../../services/matchCacheService";
import { matchCacheRepository } from "../../db/matchCacheRepository";
import { CachedMatchPayload } from "../../types/cache";

jest.mock("../../db/matchCacheRepository", () => ({
  matchCacheRepository: {
    getCache: jest.fn(),
    saveCache: jest.fn(),
    removeCache: jest.fn(),
  },
}));

describe("matchCacheService purgeSession (T019)", () => {
  const dummyPayload: CachedMatchPayload = {
    version: 1,
    matchId: 77,
    activePeriod: "q4",
    periods: {
      q1: { key: "q1", label: "Q1", remainingSeconds: 0, teamScore: 20, rivalScore: 20, teamFouls: 2, rivalFouls: 2, isCompleted: true },
      q2: { key: "q2", label: "Q2", remainingSeconds: 0, teamScore: 20, rivalScore: 20, teamFouls: 2, rivalFouls: 2, isCompleted: true },
      q3: { key: "q3", label: "Q3", remainingSeconds: 0, teamScore: 20, rivalScore: 20, teamFouls: 2, rivalFouls: 2, isCompleted: true },
      q4: { key: "q4", label: "Q4", remainingSeconds: 0, teamScore: 20, rivalScore: 20, teamFouls: 2, rivalFouls: 2, isCompleted: true },
      extra: { key: "extra", label: "EXTRA", remainingSeconds: 300, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    },
    players: [],
    timeouts: { firstHalfRemaining: 0, secondHalfRemaining: 0, extraTimeRemaining: 1 },
    swap: { isSwapMode: false, selectedCourtPlayerIds: [], selectedBenchPlayerIds: [] },
    scoreEvents: [],
    savedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calls repository.removeCache on purgeSession", async () => {
    await matchCacheService.purgeSession(77);

    expect(matchCacheRepository.removeCache).toHaveBeenCalledTimes(1);
    expect(matchCacheRepository.removeCache).toHaveBeenCalledWith(77);
  });

  it("cancels pending debounced writes so they do not resurrect purged cache", async () => {
    // Queue a debounced write
    matchCacheService.saveSession(dummyPayload, false);

    // Immediately purge the session
    await matchCacheService.purgeSession(77);
    expect(matchCacheRepository.removeCache).toHaveBeenCalledWith(77);

    // Advance time past debounce window
    jest.advanceTimersByTime(1000);

    // Verify saveCache was never called after the purge
    expect(matchCacheRepository.saveCache).not.toHaveBeenCalled();
  });
});
