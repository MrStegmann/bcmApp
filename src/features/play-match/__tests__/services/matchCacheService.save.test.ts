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

describe("matchCacheService saveSession & debouncing (T011)", () => {
  const mockPayload: CachedMatchPayload = {
    version: 1,
    matchId: 10,
    activePeriod: "q1",
    periods: {
      q1: { key: "q1", label: "Q1", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      q2: { key: "q2", label: "Q2", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      q3: { key: "q3", label: "Q3", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      q4: { key: "q4", label: "Q4", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      extra: { key: "extra", label: "EXTRA", remainingSeconds: 300, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    },
    players: [],
    timeouts: { firstHalfRemaining: 2, secondHalfRemaining: 3, extraTimeRemaining: 1 },
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

  it("flushes immediately to repository when immediate = true", async () => {
    await matchCacheService.saveSession(mockPayload, true);

    expect(matchCacheRepository.saveCache).toHaveBeenCalledTimes(1);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledWith(
      10,
      JSON.stringify(mockPayload),
      1
    );
  });

  it("debounces writes by 800ms when immediate = false", async () => {
    matchCacheService.saveSession(mockPayload, false);

    expect(matchCacheRepository.saveCache).not.toHaveBeenCalled();

    // Advance 500ms (not yet 800ms)
    jest.advanceTimersByTime(500);
    expect(matchCacheRepository.saveCache).not.toHaveBeenCalled();

    // Advance remaining 300ms
    jest.advanceTimersByTime(300);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledTimes(1);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledWith(
      10,
      JSON.stringify(mockPayload),
      1
    );
  });

  it("coalesces multiple rapid calls within 800ms and writes only the latest payload", async () => {
    const payload1 = { ...mockPayload, activePeriod: "q1" as const };
    const payload2 = { ...mockPayload, activePeriod: "q2" as const };

    matchCacheService.saveSession(payload1, false);
    jest.advanceTimersByTime(400);

    matchCacheService.saveSession(payload2, false);
    jest.advanceTimersByTime(500);
    expect(matchCacheRepository.saveCache).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledTimes(1);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledWith(
      10,
      JSON.stringify(payload2),
      1
    );
  });

  it("flushes pending write on demand via flushPendingWrite", async () => {
    matchCacheService.saveSession(mockPayload, false);
    expect(matchCacheRepository.saveCache).not.toHaveBeenCalled();

    await matchCacheService.flushPendingWrite();
    expect(matchCacheRepository.saveCache).toHaveBeenCalledTimes(1);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledWith(
      10,
      JSON.stringify(mockPayload),
      1
    );

    // Further timer advancement does not trigger an extra write
    jest.advanceTimersByTime(1000);
    expect(matchCacheRepository.saveCache).toHaveBeenCalledTimes(1);
  });
});
