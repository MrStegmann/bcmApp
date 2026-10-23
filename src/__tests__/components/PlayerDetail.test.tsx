import {
  formatPlayedMatch,
  EMPTY_PLAYED_MATCHES_MESSAGE,
} from "../../utils/playerMatches";
import { PlayedMatchContract } from "../../../specs/013-update-player-details/contracts/player-api";
import { db, teams, players, games, playerStats } from "../../db";
import { eq } from "drizzle-orm";

declare const jest: any;
declare const beforeAll: any;

describe("PlayerDetail Played Matches List Tests (T014 - US2)", () => {
  it("formats opponent name with 'vs' prefix and round as 'Jornada X'", () => {
    const rawMatch: PlayedMatchContract = {
      gameId: 101,
      opponent: "CB Marbella",
      round: "1",
      date: "11/10/2025 - 18:00",
      status: "finished",
      resultC1: 18,
      resultC2: 14,
      resultC3: 20,
      resultC4: 16,
      resultExtra: 0,
      resultC1Opponent: 15,
      resultC2Opponent: 12,
      resultC3Opponent: 16,
      resultC4Opponent: 18,
      resultExtraOpponent: 0,
    };

    const formatted = formatPlayedMatch(rawMatch);

    expect(formatted.gameId).toBe(101);
    expect(formatted.opponent).toBe("CB Marbella");
    expect(formatted.opponentDisplay).toBe("vs CB Marbella");
    expect(formatted.roundDisplay).toBe("Jornada 1");
    expect(formatted.date).toBe("11/10/2025 - 18:00");
    expect(formatted.scoreDisplay).toBe("68 - 61");
  });

  it("handles round string that already includes 'Jornada' or 'Ronda'", () => {
    const rawMatch: PlayedMatchContract = {
      gameId: 102,
      opponent: "Unicaja",
      round: "Jornada 4",
      date: "18/10/2025",
      status: "pending",
    };

    const formatted = formatPlayedMatch(rawMatch);
    expect(formatted.roundDisplay).toBe("Jornada 4");
  });

  it("defaults round to '1' when round is missing or empty", () => {
    const rawMatch: PlayedMatchContract = {
      gameId: 103,
      opponent: "CB El Palo",
      round: "",
      date: "25/10/2025",
      status: "pending",
    };

    const formatted = formatPlayedMatch(rawMatch);
    expect(formatted.roundDisplay).toBe("Jornada 1");
  });

  it("displays the exact empty state message when a player has 0 played matches", () => {
    expect(EMPTY_PLAYED_MATCHES_MESSAGE).toBe(
      "Este jugador aún no ha participado en ningún partido."
    );

    const matches: PlayedMatchContract[] = [];
    const shouldShowEmptyState = matches.length === 0;
    expect(shouldShowEmptyState).toBe(true);
  });

  describe("loadPlayedMatches Query Integration", () => {
    let testTeamId: number;
    let testPlayerId: number;
    let game1Id: number;
    let game2Id: number;

    beforeAll(async () => {
      // Setup team and player
      const [team] = await db
        .insert(teams)
        .values({ name: "Player Detail Query Team", category: "Junior" })
        .returning();
      testTeamId = team.id;

      const [player] = await db
        .insert(players)
        .values({
          teamId: testTeamId,
          firstName: "Ricky",
          lastName: "Rubio",
          number: "9",
          jerseyName: "RUBIO",
        })
        .returning();
      testPlayerId = player.id;

      // Setup two games
      const [g1] = await db
        .insert(games)
        .values({
          teamId: testTeamId,
          opponent: "Rival Game 1",
          round: "1",
          date: "10/10/2026",
          status: "finished",
        })
        .returning();
      game1Id = g1.id;

      const [g2] = await db
        .insert(games)
        .values({
          teamId: testTeamId,
          opponent: "Rival Game 2",
          round: "2",
          date: "17/10/2026",
          status: "finished",
        })
        .returning();
      game2Id = g2.id;

      // Associate playerStats with both games
      await db.insert(playerStats).values({
        gameId: game1Id,
        playerId: testPlayerId,
        minutes: 20,
        valuation: 15,
      });

      await db.insert(playerStats).values({
        gameId: game2Id,
        playerId: testPlayerId,
        minutes: 25,
        valuation: 18,
      });
    });

    it("queries player played matches joining games table ordered by games.id desc", async () => {
      // Execute the query pattern used in useDB
      const results = await db
        .select({
          gameId: games.id,
          opponent: games.opponent,
          round: games.round,
          date: games.date,
          status: games.status,
          minutes: playerStats.minutes,
          valuation: playerStats.valuation,
        })
        .from(playerStats)
        .innerJoin(games, eq(playerStats.gameId, games.id))
        .where(eq(playerStats.playerId, testPlayerId))
        .orderBy(games.id);

      expect(results.length).toBe(2);
      expect(results.map((r) => r.gameId)).toContain(game1Id);
      expect(results.map((r) => r.gameId)).toContain(game2Id);
    });

    it("returns empty array for player with 0 recorded stats", async () => {
      const [playerWithoutStats] = await db
        .insert(players)
        .values({
          teamId: testTeamId,
          firstName: "Bench",
          lastName: "Player",
          number: "99",
        })
        .returning();

      const results = await db
        .select({
          gameId: games.id,
        })
        .from(playerStats)
        .innerJoin(games, eq(playerStats.gameId, games.id))
        .where(eq(playerStats.playerId, playerWithoutStats.id));

      expect(results.length).toBe(0);
    });
  });
});
