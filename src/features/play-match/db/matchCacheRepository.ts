import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { matchCache, MatchCacheRecord } from "./schema";
import { IMatchCacheRepository } from "../types/cache";

export const matchCacheRepository: IMatchCacheRepository = {
  async getCache(matchId: number): Promise<MatchCacheRecord | null> {
    const records = await db
      .select()
      .from(matchCache)
      .where(eq(matchCache.matchId, matchId))
      .limit(1);

    if (!records || records.length === 0) {
      return null;
    }
    return records[0];
  },

  async saveCache(
    matchId: number,
    stateJson: string,
    version: number = 1
  ): Promise<void> {
    const existing = await db
      .select({ id: matchCache.id })
      .from(matchCache)
      .where(eq(matchCache.matchId, matchId))
      .limit(1);

    const now = new Date().toISOString();

    if (existing.length > 0) {
      await db
        .update(matchCache)
        .set({
          stateJson,
          version,
          lastUpdated: now,
        })
        .where(eq(matchCache.matchId, matchId));
    } else {
      await db.insert(matchCache).values({
        matchId,
        stateJson,
        version,
        lastUpdated: now,
      });
    }
  },

  async removeCache(matchId: number): Promise<void> {
    await db.delete(matchCache).where(eq(matchCache.matchId, matchId));
  },
};
