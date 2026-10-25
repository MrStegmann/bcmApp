import { matchCacheRepository } from "../db/matchCacheRepository";
import { CachedMatchPayload, IMatchCacheService } from "../types/cache";
import { validateMatchCachePayload } from "../utils/cacheValidation";

const DEBOUNCE_DELAY_MS = 800;
const DEFAULT_MAX_AGE_HOURS = 48;

class MatchCacheService implements IMatchCacheService {
  private pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingPayload: CachedMatchPayload | null = null;

  async saveSession(payload: CachedMatchPayload, immediate: boolean = false): Promise<void> {
    if (immediate) {
      if (this.pendingTimer) {
        clearTimeout(this.pendingTimer);
        this.pendingTimer = null;
      }
      this.pendingPayload = null;
      await matchCacheRepository.saveCache(
        payload.matchId,
        JSON.stringify(payload),
        payload.version
      );
      return;
    }

    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }

    this.pendingPayload = payload;

    this.pendingTimer = setTimeout(async () => {
      if (this.pendingPayload) {
        const payloadToSave = this.pendingPayload;
        this.pendingPayload = null;
        this.pendingTimer = null;
        try {
          await matchCacheRepository.saveCache(
            payloadToSave.matchId,
            JSON.stringify(payloadToSave),
            payloadToSave.version
          );
        } catch (error) {
          console.warn("[MatchCacheService] Failed to persist background cache:", error);
        }
      }
    }, DEBOUNCE_DELAY_MS);
  }

  async flushPendingWrite(): Promise<void> {
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }

    if (this.pendingPayload) {
      const payloadToSave = this.pendingPayload;
      this.pendingPayload = null;
      await matchCacheRepository.saveCache(
        payloadToSave.matchId,
        JSON.stringify(payloadToSave),
        payloadToSave.version
      );
    }
  }

  async loadSession(matchId: number): Promise<CachedMatchPayload | null> {
    if (this.pendingPayload && this.pendingPayload.matchId === matchId) {
      await this.flushPendingWrite();
    }

    const record = await matchCacheRepository.getCache(matchId);
    if (!record) {
      return null;
    }

    try {
      const parsed = JSON.parse(record.stateJson);
      if (!validateMatchCachePayload(parsed)) {
        console.warn(
          `[MatchCacheService] Invalid or corrupted cache payload for match ${matchId}. Purging damaged record.`
        );
        await this.purgeSession(matchId);
        return null;
      }
      return parsed;
    } catch (error) {
      console.warn(
        `[MatchCacheService] Malformed JSON in cache for match ${matchId}. Purging damaged record.`,
        error
      );
      await this.purgeSession(matchId);
      return null;
    }
  }

  async purgeSession(matchId: number): Promise<void> {
    if (this.pendingPayload && this.pendingPayload.matchId === matchId) {
      if (this.pendingTimer) {
        clearTimeout(this.pendingTimer);
        this.pendingTimer = null;
      }
      this.pendingPayload = null;
    }
    await matchCacheRepository.removeCache(matchId);
  }

  isCacheStale(payload: CachedMatchPayload, maxAgeHours: number = DEFAULT_MAX_AGE_HOURS): boolean {
    if (!payload.savedAt) return true;
    const savedTime = new Date(payload.savedAt).getTime();
    if (Number.isNaN(savedTime)) return true;
    const ageMs = Date.now() - savedTime;
    return ageMs > maxAgeHours * 60 * 60 * 1000;
  }
}

export const matchCacheService = new MatchCacheService();
