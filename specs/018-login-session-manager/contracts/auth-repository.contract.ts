/**
 * Contract: Auth Session SQLite Repository
 */

import type { AuthSessionRecord } from "../../../src/features/auth/db/schema";

export interface CachedSessionPayload {
  token: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  user: {
    id: number;
    username: string;
    status: string;
    createdAt: string;
  };
}

export interface IAuthSessionRepository {
  /**
   * Persists a session into the auth_sessions table.
   * Replaces any existing session to ensure only one active session exists.
   */
  saveSession(payload: CachedSessionPayload): Promise<AuthSessionRecord>;

  /**
   * Retrieves the current cached session if one exists.
   * Returns null if the table is empty or the row is corrupted.
   */
  getActiveSession(): Promise<AuthSessionRecord | null>;

  /**
   * Clears all session records from the auth_sessions table.
   */
  clearSession(): Promise<void>;

  /**
   * Checks whether a session record is currently valid (non-expired).
   */
  isSessionValid(session: AuthSessionRecord): boolean;
}
