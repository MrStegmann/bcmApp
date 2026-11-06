import { authSessionRepository } from "../../db/authSessionRepository";
import { db, initDatabase } from "../../../../db";
import { authSessions } from "../../../../db/schema";
import { CachedSessionPayload } from "../../types";

describe("authSessionRepository - Expiration & Corrupt Cache (US4, FR-006, SC-006)", () => {
  beforeAll(() => {
    initDatabase();
  });

  beforeEach(async () => {
    await db.delete(authSessions);
  });

  const samplePayload: CachedSessionPayload = {
    token: "valid-token-expiry-check",
    tokenType: "Bearer",
    expiresIn: 3600,
    expiresAt: new Date(Date.now() - 10000).toISOString(), // expired in past
    user: {
      id: 5,
      username: "ExpiredUser",
      status: "ACTIVE",
      createdAt: "2026-11-01T00:00:00Z",
    },
  };

  it("identifies a session with past expiresAt timestamp as invalid", async () => {
    const saved = await authSessionRepository.saveSession(samplePayload);
    const isValid = authSessionRepository.isSessionValid(saved);

    expect(isValid).toBe(false);
  });

  it("purges corrupt database rows and returns null on getActiveSession", async () => {
    // Insert corrupt record with null token
    await db.insert(authSessions).values({
      token: "",
      tokenType: "Bearer",
      expiresIn: 3600,
      expiresAt: "invalid-iso-date",
      userId: 1,
      username: "",
      userStatus: "ACTIVE",
      userCreatedAt: "2026-01-01",
    });

    const active = await authSessionRepository.getActiveSession();
    expect(active).toBeNull();

    // Verify row was deleted
    const all = await db.select().from(authSessions);
    expect(all.length).toBe(0);
  });
});

