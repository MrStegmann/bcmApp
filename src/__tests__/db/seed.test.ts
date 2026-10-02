import { seedDatabase, clearDatabase } from "../../../scripts/seed-db";

describe("Database Seed Script Tests", () => {
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

  it("should run seedDatabase and return summary of 3 teams, 36 players (10, 12, 14), 21 games, 30 trainings", async () => {
    const summary = await seedDatabase();

    expect(summary.teamsCount).toBe(3);
    expect(summary.playersCount).toBe(36); // 10 + 12 + 14
    expect(summary.gamesCount).toBe(21); // 7 + 7 + 7
    expect(summary.trainingsCount).toBe(30); // 10 + 10 + 10
  });
});
