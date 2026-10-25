import { validateMatchCachePayload } from "../../utils/cacheValidation";
import { CachedMatchPayload } from "../../types/cache";

describe("cacheValidation utility (T007)", () => {
  const validPayload: CachedMatchPayload = {
    version: 1,
    matchId: 42,
    activePeriod: "q1",
    periods: {
      q1: {
        key: "q1",
        label: "Q1",
        remainingSeconds: 600,
        teamScore: 10,
        rivalScore: 8,
        teamFouls: 2,
        rivalFouls: 3,
        isCompleted: false,
      },
      q2: {
        key: "q2",
        label: "Q2",
        remainingSeconds: 600,
        teamScore: 0,
        rivalScore: 0,
        teamFouls: 0,
        rivalFouls: 0,
        isCompleted: false,
      },
      q3: {
        key: "q3",
        label: "Q3",
        remainingSeconds: 600,
        teamScore: 0,
        rivalScore: 0,
        teamFouls: 0,
        rivalFouls: 0,
        isCompleted: false,
      },
      q4: {
        key: "q4",
        label: "Q4",
        remainingSeconds: 600,
        teamScore: 0,
        rivalScore: 0,
        teamFouls: 0,
        rivalFouls: 0,
        isCompleted: false,
      },
      extra: {
        key: "extra",
        label: "EXTRA",
        remainingSeconds: 300,
        teamScore: 0,
        rivalScore: 0,
        teamFouls: 0,
        rivalFouls: 0,
        isCompleted: false,
      },
    },
    players: [
      {
        id: 1,
        firstName: "Marc",
        lastName: "Gasol",
        number: "33",
        jerseyName: "M. Gasol",
        position: "C",
        isOnCourt: true,
        courtPositionIndex: 0,
        secondsPlayed: 120,
        stintSeconds: 120,
        t1a: 0,
        t1i: 0,
        t2a: 2,
        t2i: 1,
        t3a: 0,
        t3i: 0,
        oreb: 1,
        dreb: 2,
        asis: 1,
        rec: 0,
        per: 0,
        falt: 1,
        valuation: 5,
      },
    ],
    timeouts: {
      firstHalfRemaining: 2,
      secondHalfRemaining: 3,
      extraTimeRemaining: 1,
    },
    swap: {
      isSwapMode: false,
      selectedCourtPlayerIds: [],
      selectedBenchPlayerIds: [],
    },
    scoreEvents: [],
    savedAt: new Date().toISOString(),
  };

  it("validates a complete, correctly-formed CachedMatchPayload", () => {
    expect(validateMatchCachePayload(validPayload)).toBe(true);
  });

  it("rejects non-object or null input", () => {
    expect(validateMatchCachePayload(null)).toBe(false);
    expect(validateMatchCachePayload(undefined)).toBe(false);
    expect(validateMatchCachePayload("string")).toBe(false);
    expect(validateMatchCachePayload(123)).toBe(false);
  });

  it("rejects unsupported or missing schema version", () => {
    expect(validateMatchCachePayload({ ...validPayload, version: 0 })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, version: 2 })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, version: undefined as any })).toBe(false);
  });

  it("rejects missing or non-positive matchId", () => {
    expect(validateMatchCachePayload({ ...validPayload, matchId: 0 })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, matchId: -5 })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, matchId: "42" as any })).toBe(false);
  });

  it("rejects invalid activePeriod", () => {
    expect(validateMatchCachePayload({ ...validPayload, activePeriod: "invalid" as any })).toBe(false);
  });

  it("rejects missing periods or incomplete period keys", () => {
    const { q4, ...incompletePeriods } = validPayload.periods;
    expect(validateMatchCachePayload({ ...validPayload, periods: incompletePeriods as any })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, periods: null as any })).toBe(false);
  });

  it("rejects non-array players", () => {
    expect(validateMatchCachePayload({ ...validPayload, players: "not-an-array" as any })).toBe(false);
  });

  it("rejects missing timeouts, swap, or scoreEvents", () => {
    expect(validateMatchCachePayload({ ...validPayload, timeouts: null as any })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, swap: null as any })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, scoreEvents: null as any })).toBe(false);
  });

  it("rejects invalid or missing savedAt timestamp", () => {
    expect(validateMatchCachePayload({ ...validPayload, savedAt: "invalid-date" })).toBe(false);
    expect(validateMatchCachePayload({ ...validPayload, savedAt: "" })).toBe(false);
  });
});
