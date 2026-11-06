import { authSessionRepository } from "../../db/authSessionRepository";
import { db, initDatabase } from "../../../../db";
import { authSessions } from "../../../../db/schema";
import { CachedSessionPayload } from "../../types";

describe("authSessionRepository", () => {
  beforeAll(() => {
    initDatabase();
  });

  beforeEach(async () => {
    await db.delete(authSessions);
  });

  const mockSessionPayload: CachedSessionPayload = {
    token: "mock-jwt-token-12345",
    tokenType: "Bearer",
    expiresIn: 86400,
    expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
    user: {
      id: 1,
      username: "Patrick.JS",
      status: "ACTIVE",
      createdAt: "2026-11-01T09:49:33.990499Z",
    },
  };

  it("returns null when no session exists in the database", async () => {
    const session = await authSessionRepository.getActiveSession();
    expect(session).toBeNull();
  });

  it("saves a new session payload and retrieves it via getActiveSession", async () => {
    const saved = await authSessionRepository.saveSession(mockSessionPayload);

    expect(saved).toBeDefined();
    expect(saved.id).toBeDefined();
    expect(saved.token).toBe(mockSessionPayload.token);
    expect(saved.username).toBe(mockSessionPayload.user.username);
    expect(saved.userId).toBe(mockSessionPayload.user.id);

    const active = await authSessionRepository.getActiveSession();
    expect(active).not.toBeNull();
    expect(active?.token).toBe(mockSessionPayload.token);
    expect(active?.username).toBe("Patrick.JS");
  });

  it("ensures only one active session exists by replacing previous session on saveSession", async () => {
    await authSessionRepository.saveSession(mockSessionPayload);

    const secondPayload: CachedSessionPayload = {
      ...mockSessionPayload,
      token: "second-token-67890",
      user: {
        ...mockSessionPayload.user,
        username: "NewUser",
      },
    };

    await authSessionRepository.saveSession(secondPayload);

    const allSessions = await db.select().from(authSessions);
    expect(allSessions.length).toBe(1);
    expect(allSessions[0].token).toBe("second-token-67890");
    expect(allSessions[0].username).toBe("NewUser");
  });

  it("clears all session records on clearSession", async () => {
    await authSessionRepository.saveSession(mockSessionPayload);
    await authSessionRepository.clearSession();

    const active = await authSessionRepository.getActiveSession();
    expect(active).toBeNull();

    const allSessions = await db.select().from(authSessions);
    expect(allSessions.length).toBe(0);
  });

  it("correctly identifies valid vs expired session with isSessionValid", () => {
    const validSession = {
      id: 1,
      token: "tok",
      tokenType: "Bearer",
      expiresIn: 3600,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      userId: 1,
      username: "user",
      userStatus: "ACTIVE",
      userCreatedAt: "2026-01-01T00:00:00Z",
      createdAt: new Date().toISOString(),
    };

    expect(authSessionRepository.isSessionValid(validSession)).toBe(true);

    const expiredSession = {
      ...validSession,
      expiresAt: new Date(Date.now() - 5000).toISOString(),
    };

    expect(authSessionRepository.isSessionValid(expiredSession)).toBe(false);

    const malformedSession = {
      ...validSession,
      expiresAt: "not-a-valid-date",
    };

    expect(authSessionRepository.isSessionValid(malformedSession)).toBe(false);
  });

  it("handles corrupted database rows by clearing the table and returning null", async () => {
    // Insert a malformed row directly into the table
    await db.insert(authSessions).values({
      token: "",
      tokenType: "",
      expiresIn: 0,
      expiresAt: "invalid-iso-date",
      userId: 0,
      username: "",
      userStatus: "",
      userCreatedAt: "",
    });

    const active = await authSessionRepository.getActiveSession();
    expect(active).toBeNull();

    // Verify corrupt row was cleared
    const remaining = await db.select().from(authSessions);
    expect(remaining.length).toBe(0);
  });
});

