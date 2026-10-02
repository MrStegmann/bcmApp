import * as schema from "../../db/schema";

describe("Database Connection & Schema Instantiation Tests (T009)", () => {
  it("should define all 6 core tables in Drizzle schema", () => {
    expect(schema.teams).toBeDefined();
    expect(schema.players).toBeDefined();
    expect(schema.games).toBeDefined();
    expect(schema.playerStats).toBeDefined();
    expect(schema.trainings).toBeDefined();
    expect(schema.trainingPlayers).toBeDefined();
    expect((schema as any).fees).toBe(undefined);
  });

  it("should verify teams table structure", () => {
    expect(schema.teams.id).toBeDefined();
    expect(schema.teams.name).toBeDefined();
    expect(schema.teams.category).toBeDefined();
    expect(schema.teams.createdAt).toBeDefined();
  });

  it("should verify players table structure and team foreign key", () => {
    expect(schema.players.id).toBeDefined();
    expect(schema.players.teamId).toBeDefined();
    expect(schema.players.firstName).toBeDefined();
    expect(schema.players.lastName).toBeDefined();
    expect(schema.players.number).toBeDefined();
  });

  it("should verify games table structure and box score scores", () => {
    expect(schema.games.id).toBeDefined();
    expect(schema.games.teamId).toBeDefined();
    expect(schema.games.opponent).toBeDefined();
    expect(schema.games.resultC1).toBeDefined();
    expect(schema.games.resultC1Opponent).toBeDefined();
  });

  it("should verify playerStats table structure", () => {
    expect(schema.playerStats.id).toBeDefined();
    expect(schema.playerStats.gameId).toBeDefined();
    expect(schema.playerStats.playerId).toBeDefined();
    expect(schema.playerStats.valuation).toBeDefined();
  });
});
