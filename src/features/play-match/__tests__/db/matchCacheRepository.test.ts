import { matchCacheRepository } from "../../db/matchCacheRepository";
import { db } from "../../../../db";
import { matchCache, games, teams } from "../../../../db/schema";
import { eq } from "drizzle-orm";

describe("matchCacheRepository (T005)", () => {
  let testTeamId: number;
  let testGameId: number;

  beforeEach(async () => {
    // Clear test tables
    await db.delete(matchCache);
    await db.delete(games);
    await db.delete(teams);

    // Insert a parent team and game for foreign key integrity
    const [team] = await db
      .insert(teams)
      .values({ name: "BCM Test Team", category: "Senior" })
      .returning();
    testTeamId = team.id;

    const [game] = await db
      .insert(games)
      .values({
        teamId: testTeamId,
        opponent: "Rival Test Club",
        round: "1",
        date: "2026-10-25",
        status: "in_progress",
      })
      .returning();
    testGameId = game.id;
  });

  it("returns null when no cache exists for the given matchId", async () => {
    const result = await matchCacheRepository.getCache(testGameId);
    expect(result).toBeNull();
  });

  it("saves a new cache entry and retrieves it", async () => {
    const sampleJson = JSON.stringify({ matchId: testGameId, version: 1, sample: "data" });
    await matchCacheRepository.saveCache(testGameId, sampleJson, 1);

    const record = await matchCacheRepository.getCache(testGameId);
    expect(record).not.toBeNull();
    expect(record?.matchId).toBe(testGameId);
    expect(record?.stateJson).toBe(sampleJson);
    expect(record?.version).toBe(1);
    expect(record?.lastUpdated).toBeDefined();
  });

  it("upserts existing cache entry on duplicate save without failing unique constraint", async () => {
    const json1 = JSON.stringify({ step: 1 });
    const json2 = JSON.stringify({ step: 2 });

    await matchCacheRepository.saveCache(testGameId, json1, 1);
    let record = await matchCacheRepository.getCache(testGameId);
    expect(record?.stateJson).toBe(json1);

    // Upsert with new data
    await matchCacheRepository.saveCache(testGameId, json2, 1);
    record = await matchCacheRepository.getCache(testGameId);
    expect(record?.stateJson).toBe(json2);

    // Verify only 1 row exists
    const rows = await db
      .select()
      .from(matchCache)
      .where(eq(matchCache.matchId, testGameId));
    expect(rows).toHaveLength(1);
  });

  it("removes cache entry silently if it exists or does not exist", async () => {
    const sampleJson = JSON.stringify({ matchId: testGameId, version: 1 });
    await matchCacheRepository.saveCache(testGameId, sampleJson, 1);

    let record = await matchCacheRepository.getCache(testGameId);
    expect(record).not.toBeNull();

    await matchCacheRepository.removeCache(testGameId);
    record = await matchCacheRepository.getCache(testGameId);
    expect(record).toBeNull();

    // Calling again does not throw
    let error: unknown = null;
    try {
      await matchCacheRepository.removeCache(testGameId);
    } catch (err) {
      error = err;
    }
    expect(error).toBeNull();
  });
});
