import { seedDatabase, clearDatabase } from "../../../scripts/seed-db";
import { db, teams, players, games, playerStats } from "../../db";
import { eq } from "drizzle-orm";

describe("Database Seed Script Tests", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should export seedDatabase and clearDatabase functions", () => {
    expect(typeof seedDatabase).toBe("function");
    expect(typeof clearDatabase).toBe("function");
  });

  it("should run clearDatabase without errors", async () => {
    let error: unknown = null;
    try {
      await clearDatabase();
    } catch (err) {
      error = err;
    }
    expect(error).toBeNull();
  });

  describe("User Story 1 Integration: Team and Player Seeding", () => {
    it("should insert team and 12+ players retrievable from database", async () => {
      await seedDatabase();

      const seededTeams = await db.select().from(teams);
      expect(seededTeams.length).toBe(1);
      expect(seededTeams[0].name).toBe("CB Salliver");
      expect(seededTeams[0].category).toBe("Junior Celeste");

      const seededPlayers = await db
        .select()
        .from(players)
        .where(eq(players.teamId, seededTeams[0].id));
      expect(seededPlayers.length).toBeGreaterThanOrEqual(12);

      // Verify each player has position and unique number
      const numbers = seededPlayers.map((p) => p.number);
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBe(seededPlayers.length);

      seededPlayers.forEach((p) => {
        expect(p.position).toBeDefined();
        expect(p.position).not.toBeNull();
      });
    });
  });

  describe("User Story 2 Integration: Match Schedule Seeding", () => {
    it("should seed exactly 10 games with 5 finished and 5 pending associated with the team", async () => {
      await seedDatabase();

      const seededGames = await db.select().from(games);
      expect(seededGames.length).toBe(10);

      const [team] = await db.select().from(teams);
      seededGames.forEach((g) => {
        expect(g.teamId).toBe(team.id);
        expect(g.opponent.length).toBeGreaterThan(0);
        expect(g.round.length).toBeGreaterThan(0);
      });

      const finished = seededGames.filter((g) => g.status === "finished");
      const pending = seededGames.filter((g) => g.status === "pending");
      expect(finished.length).toBe(5);
      expect(pending.length).toBe(5);
    });
  });

  describe("User Story 3 Integration: Player Stats Database Seeding", () => {
    it("should seed exactly 60 player stat records linked to valid games and players", async () => {
      await seedDatabase();

      const seededStats = await db.select().from(playerStats);
      expect(seededStats.length).toBe(60);

      const seededGames = await db.select().from(games);
      const gameIds = new Set(seededGames.map((g) => g.id));

      const seededPlayers = await db.select().from(players);
      const playerIds = new Set(seededPlayers.map((p) => p.id));

      seededStats.forEach((stat) => {
        expect(gameIds.has(stat.gameId)).toBe(true);
        expect(playerIds.has(stat.playerId)).toBe(true);
      });
    });

    it("should verify player points in database reconcile to finished games scores", async () => {
      await seedDatabase();

      const finishedGames = await db
        .select()
        .from(games)
        .where(eq(games.status, "finished"));

      for (const game of finishedGames) {
        const stats = await db
          .select()
          .from(playerStats)
          .where(eq(playerStats.gameId, game.id));

        expect(stats.length).toBe(12);

        const totalGamePoints =
          (game.resultC1 || 0) +
          (game.resultC2 || 0) +
          (game.resultC3 || 0) +
          (game.resultC4 || 0) +
          (game.resultExtra || 0);

        const sumStatsPoints = stats.reduce(
          (acc, s) => acc + (s.t1a || 0) * 1 + (s.t2a || 0) * 2 + (s.t3a || 0) * 3,
          0
        );

        expect(sumStatsPoints).toBe(totalGamePoints);
      }
    });
  });

  describe("User Story 4 Integration: Repeatable Seeding, Summary & Reset", () => {
    it("should return the exact SeedSummaryResult contract", async () => {
      const summary = await seedDatabase();

      expect(summary).toEqual({
        teamsCount: 1,
        playersCount: 12,
        gamesCount: 10,
        finishedGamesCount: 5,
        pendingGamesCount: 5,
        playerStatsCount: 60,
      });
    });

    it("should be idempotent across multiple consecutive executions without orphaned records", async () => {
      const summary1 = await seedDatabase();
      const summary2 = await seedDatabase();

      expect(summary1).toEqual(summary2);

      const allTeams = await db.select().from(teams);
      const allPlayers = await db.select().from(players);
      const allGames = await db.select().from(games);
      const allStats = await db.select().from(playerStats);

      expect(allTeams.length).toBe(1);
      expect(allPlayers.length).toBe(12);
      expect(allGames.length).toBe(10);
      expect(allStats.length).toBe(60);
    });

    it("should completely empty all tables when clearDatabase is invoked", async () => {
      await seedDatabase();
      await clearDatabase();

      const allTeams = await db.select().from(teams);
      const allPlayers = await db.select().from(players);
      const allGames = await db.select().from(games);
      const allStats = await db.select().from(playerStats);

      expect(allTeams.length).toBe(0);
      expect(allPlayers.length).toBe(0);
      expect(allGames.length).toBe(0);
      expect(allStats.length).toBe(0);
    });

    it("should fail and abort seeding if pre-seed validation encounters invalid dataset", async () => {
      const invalidDataset = {
        name: "", // Invalid name
        category: "Test",
        players: [],
        games: [],
      };

      let error: unknown = null;
      try {
        await seedDatabase(invalidDataset as any);
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeNull();
    });
  });
});



