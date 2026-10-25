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

describe("matchCacheService loadSession & staleness evaluation (T016)", () => {
  const validPayload: CachedMatchPayload = {
    version: 1,
    matchId: 44,
    activePeriod: "q3",
    periods: {
      q1: { key: "q1", label: "Q1", remainingSeconds: 0, teamScore: 10, rivalScore: 10, teamFouls: 1, rivalFouls: 1, isCompleted: true },
      q2: { key: "q2", label: "Q2", remainingSeconds: 0, teamScore: 15, rivalScore: 12, teamFouls: 2, rivalFouls: 3, isCompleted: true },
      q3: { key: "q3", label: "Q3", remainingSeconds: 500, teamScore: 4, rivalScore: 2, teamFouls: 0, rivalFouls: 1, isCompleted: false },
      q4: { key: "q4", label: "Q4", remainingSeconds: 600, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
      extra: { key: "extra", label: "EXTRA", remainingSeconds: 300, teamScore: 0, rivalScore: 0, teamFouls: 0, rivalFouls: 0, isCompleted: false },
    },
    players: [],
    timeouts: { firstHalfRemaining: 0, secondHalfRemaining: 3, extraTimeRemaining: 1 },
    swap: { isSwapMode: false, selectedCourtPlayerIds: [], selectedBenchPlayerIds: [] },
    scoreEvents: [],
    savedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when repository has no cached record", async () => {
    (matchCacheRepository.getCache as jest.Mock).mockResolvedValue(null);

    const result = await matchCacheService.loadSession(44);
    expect(result).toBeNull();
    expect(matchCacheRepository.getCache).toHaveBeenCalledWith(44);
  });

  it("loads and returns valid cached session from repository", async () => {
    (matchCacheRepository.getCache as jest.Mock).mockResolvedValue({
      id: 1,
      matchId: 44,
      stateJson: JSON.stringify(validPayload),
      version: 1,
      lastUpdated: new Date().toISOString(),
    });

    const result = await matchCacheService.loadSession(44);
    expect(result).toEqual(validPayload);
  });

  it("evaluates staleness correctly based on savedAt timestamp", () => {
    const freshPayload = {
      ...validPayload,
      savedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    };
    expect(matchCacheService.isCacheStale(freshPayload)).toBe(false);

    const stalePayload = {
      ...validPayload,
      savedAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(), // 50 hours ago
    };
    expect(matchCacheService.isCacheStale(stalePayload)).toBe(true);

    // Custom maxAgeHours
    expect(matchCacheService.isCacheStale(freshPayload, 1)).toBe(true); // older than 1 hour

    // Invalid savedAt
    const invalidPayload = { ...validPayload, savedAt: "not-a-date" };
    expect(matchCacheService.isCacheStale(invalidPayload)).toBe(true);
  });
});
