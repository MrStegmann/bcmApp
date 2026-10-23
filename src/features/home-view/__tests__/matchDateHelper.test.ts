import {
  parseMatchDate,
  sortPendingMatches,
  sortFinishedMatches,
  formatRoundLabel,
} from "../utils/matchDateHelper";
import { Game } from "../../../types/database";

describe("matchDateHelper Unit Tests (T003)", () => {
  describe("formatRoundLabel", () => {
    it("should format numeric rounds with Jornada prefix", () => {
      expect(formatRoundLabel(1)).toBe("Jornada 1");
      expect(formatRoundLabel(12)).toBe("Jornada 12");
      expect(formatRoundLabel(0)).toBe("Jornada 0");
    });

    it("should format string numbers with Jornada prefix", () => {
      expect(formatRoundLabel("3")).toBe("Jornada 3");
    });

    it("should preserve already formatted strings starting with Jornada or lowercase jornada", () => {
      expect(formatRoundLabel("Jornada 5")).toBe("Jornada 5");
      expect(formatRoundLabel("jornada 5")).toBe("jornada 5");
      expect(formatRoundLabel("JORNADA 8")).toBe("JORNADA 8");
    });

    it("should handle null, undefined, or empty values safely without throwing errors", () => {
      expect(formatRoundLabel(null)).toBe("");
      expect(formatRoundLabel(undefined)).toBe("");
      expect(formatRoundLabel("")).toBe("");
      expect(formatRoundLabel("   ")).toBe("");
    });
  });

  describe("parseMatchDate", () => {
    it("should parse date-only format 'dd/mm/aaaa' correctly", () => {
      const timestamp = parseMatchDate("22/10/2026");
      const expected = new Date(2026, 9, 22).getTime();
      expect(timestamp).toBe(expected);
    });

    it("should parse standard format 'dd/mm/aaaa - hh:mm' correctly", () => {
      const timestamp = parseMatchDate("22/10/2026 - 18:30");
      const expected = new Date(2026, 9, 22, 18, 30).getTime();
      expect(timestamp).toBe(expected);
    });

    it("should parse standard ISO string if passed", () => {
      const iso = "2026-10-22T18:30:00.000Z";
      expect(parseMatchDate(iso)).toBe(new Date(iso).getTime());
    });

    it("should return 0 for invalid or empty dates without crashing", () => {
      expect(parseMatchDate("")).toBe(0);
      expect(parseMatchDate(null as any)).toBe(0);
      expect(parseMatchDate(undefined as any)).toBe(0);
      expect(parseMatchDate("invalid-date-string")).toBe(0);
    });
  });

  describe("sortPendingMatches (Next Match Chronology)", () => {
    it("should sort pending matches ascending (earliest first) with date-only format", () => {
      const g1 = { id: 1, date: "25/10/2026", round: "2", status: "pending" } as Game;
      const g2 = { id: 2, date: "20/10/2026", round: "1", status: "pending" } as Game;
      const g3 = { id: 3, date: "22/10/2026", round: "1", status: "pending" } as Game;

      const sorted = sortPendingMatches([g1, g2, g3]);
      expect(sorted.map((g) => g.id)).toEqual([2, 3, 1]);
    });

    it("should sort pending matches ascending (earliest first) with legacy timestamps", () => {
      const g1 = { id: 1, date: "25/10/2026 - 10:00", round: "2", status: "pending" } as Game;
      const g2 = { id: 2, date: "20/10/2026 - 18:00", round: "1", status: "pending" } as Game;
      const g3 = { id: 3, date: "22/10/2026 - 12:00", round: "1", status: "pending" } as Game;

      const sorted = sortPendingMatches([g1, g2, g3]);
      expect(sorted.map((g) => g.id)).toEqual([2, 3, 1]);
    });

    it("should apply tie-breakers (round ascending, then id ascending) when dates match", () => {
      const g1 = { id: 10, date: "20/10/2026 - 18:00", round: "2", status: "pending" } as Game;
      const g2 = { id: 5, date: "20/10/2026 - 18:00", round: "1", status: "pending" } as Game;
      const g3 = { id: 2, date: "20/10/2026 - 18:00", round: "1", status: "pending" } as Game;

      const sorted = sortPendingMatches([g1, g2, g3]);
      // g2 and g3 have round "1", g3 id is 2 < g2 id 5, g1 has round "2"
      expect(sorted.map((g) => g.id)).toEqual([2, 5, 10]);
    });
  });

  describe("sortFinishedMatches (Recent Matches History)", () => {
    it("should sort finished matches descending (newest first)", () => {
      const g1 = { id: 1, date: "10/10/2026 - 18:00", status: "finished" } as Game;
      const g2 = { id: 2, date: "18/10/2026 - 20:00", status: "finished" } as Game;
      const g3 = { id: 3, date: "15/10/2026 - 12:00", status: "finished" } as Game;

      const sorted = sortFinishedMatches([g1, g2, g3]);
      expect(sorted.map((g) => g.id)).toEqual([2, 3, 1]);
    });

    it("should tie-break by id descending if date is identical", () => {
      const g1 = { id: 4, date: "18/10/2026 - 20:00", status: "finished" } as Game;
      const g2 = { id: 9, date: "18/10/2026 - 20:00", status: "finished" } as Game;

      const sorted = sortFinishedMatches([g1, g2]);
      expect(sorted.map((g) => g.id)).toEqual([9, 4]);
    });
  });
});
