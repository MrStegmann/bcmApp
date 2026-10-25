import { matchCacheService } from "../../services/matchCacheService";
import { matchCacheRepository } from "../../db/matchCacheRepository";

jest.mock("../../db/matchCacheRepository", () => ({
  matchCacheRepository: {
    getCache: jest.fn(),
    saveCache: jest.fn(),
    removeCache: jest.fn(),
  },
}));

describe("matchCacheService corruption resilience (T023)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it("handles malformed JSON gracefully, purges record, and returns null", async () => {
    (matchCacheRepository.getCache as jest.Mock).mockResolvedValue({
      id: 1,
      matchId: 88,
      stateJson: "{invalid-json--corrupted",
      version: 1,
      lastUpdated: new Date().toISOString(),
    });

    const result = await matchCacheService.loadSession(88);

    expect(result).toBeNull();
    expect(matchCacheRepository.removeCache).toHaveBeenCalledWith(88);
    expect(console.warn).toHaveBeenCalled();
  });

  it("handles schema version mismatch, purges record, and returns null", async () => {
    const invalidVersionPayload = {
      version: 99, // unsupported version
      matchId: 88,
      activePeriod: "q1",
      periods: {},
    };

    (matchCacheRepository.getCache as jest.Mock).mockResolvedValue({
      id: 2,
      matchId: 88,
      stateJson: JSON.stringify(invalidVersionPayload),
      version: 99,
      lastUpdated: new Date().toISOString(),
    });

    const result = await matchCacheService.loadSession(88);

    expect(result).toBeNull();
    expect(matchCacheRepository.removeCache).toHaveBeenCalledWith(88);
    expect(console.warn).toHaveBeenCalled();
  });

  it("handles structurally incomplete payload, purges record, and returns null", async () => {
    const incompletePayload = {
      version: 1,
      matchId: 88,
      // missing activePeriod, periods, players, etc.
    };

    (matchCacheRepository.getCache as jest.Mock).mockResolvedValue({
      id: 3,
      matchId: 88,
      stateJson: JSON.stringify(incompletePayload),
      version: 1,
      lastUpdated: new Date().toISOString(),
    });

    const result = await matchCacheService.loadSession(88);

    expect(result).toBeNull();
    expect(matchCacheRepository.removeCache).toHaveBeenCalledWith(88);
    expect(console.warn).toHaveBeenCalled();
  });
});
