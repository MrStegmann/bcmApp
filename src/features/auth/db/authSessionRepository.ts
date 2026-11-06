import { db } from "../../../db";
import { authSessions, AuthSessionRecord } from "./schema";
import { CachedSessionPayload } from "../types";

export interface IAuthSessionRepository {
  saveSession(payload: CachedSessionPayload): Promise<AuthSessionRecord>;
  getActiveSession(): Promise<AuthSessionRecord | null>;
  clearSession(): Promise<void>;
  isSessionValid(session: AuthSessionRecord): boolean;
}

export const authSessionRepository: IAuthSessionRepository = {
  async saveSession(payload: CachedSessionPayload): Promise<AuthSessionRecord> {
    await db.delete(authSessions);

    const [inserted] = await db
      .insert(authSessions)
      .values({
        token: payload.token,
        tokenType: payload.tokenType || "Bearer",
        expiresIn: payload.expiresIn,
        expiresAt: payload.expiresAt,
        userId: payload.user.id,
        username: payload.user.username,
        userStatus: payload.user.status,
        userCreatedAt: payload.user.createdAt,
      })
      .returning();

    return inserted;
  },

  async getActiveSession(): Promise<AuthSessionRecord | null> {
    try {
      const records = await db.select().from(authSessions).limit(1);
      if (!records || records.length === 0) {
        return null;
      }

      const session = records[0];
      if (
        !session.token ||
        !session.username ||
        !session.expiresAt ||
        isNaN(new Date(session.expiresAt).getTime())
      ) {
        await this.clearSession();
        return null;
      }

      return session;
    } catch {
      await this.clearSession();
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await db.delete(authSessions);
  },

  isSessionValid(session: AuthSessionRecord): boolean {
    if (!session || !session.expiresAt) {
      return false;
    }
    const expiryTime = new Date(session.expiresAt).getTime();
    if (isNaN(expiryTime)) {
      return false;
    }
    return Date.now() < expiryTime;
  },
};

