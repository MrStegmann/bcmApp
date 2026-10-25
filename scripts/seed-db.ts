import { db } from "../src/db";
import {
  teams,
  players,
  games,
  playerStats,
} from "../src/db/schema";
import { MOCK_TEAM_DATA } from "../src/db/mock/mockTeamData";
import { MockTeamDatasetConfig, SeedSummaryResult } from "../src/types/mockData";
import { validateDataset } from "../src/db/mock/mockDataValidator";

declare const module: any;

/**
 * Clears all data from the database to guarantee a fresh start.
 * Deletion order respects foreign keys: playerStats -> games -> players -> teams.
 */
export async function clearDatabase(): Promise<void> {
  console.log("🧹 Clearing database...");
  await db.delete(playerStats);
  await db.delete(games);
  await db.delete(players);
  await db.delete(teams);
  console.log("✅ Database cleared successfully.");
}

/**
 * Main database seed function.
 * Clears all existing tables and populates with realistic, comprehensive basketball data.
 */
export async function seedDatabase(
  dataset: MockTeamDatasetConfig = MOCK_TEAM_DATA
): Promise<SeedSummaryResult> {
  // Pre-seed validation check
  const validation = validateDataset(dataset);
  if (!validation.isValid) {
    throw new Error(
      `Dataset validation failed prior to database seeding:\n${validation.errors.join("\n")}`
    );
  }

  console.log("🌱 Starting full database seed...");

  // 1. Clear existing database
  await clearDatabase();


  let totalPlayersCount = 0;
  let totalGamesCount = 0;
  let finishedGamesCount = 0;
  let pendingGamesCount = 0;
  let totalPlayerStatsCount = 0;

  // 2. Insert Team
  const [insertedTeam] = await db
    .insert(teams)
    .values({
      name: dataset.name,
      category: dataset.category,
    })
    .returning();

  const teamId = insertedTeam.id;
  console.log(`🏀 Created team #${teamId}: "${dataset.name}" (${dataset.category})`);

  // 3. Insert Players
  const playerMap = new Map<string, number>(); // jersey number -> player id
  for (const p of dataset.players) {
    const [player] = await db
      .insert(players)
      .values({
        teamId,
        firstName: p.firstName,
        lastName: p.lastName,
        number: p.number,
        jerseyName: p.jerseyName,
      })
      .returning();

    playerMap.set(p.number, player.id);
    totalPlayersCount++;
  }
  console.log(`   👥 Inserted ${totalPlayersCount} players.`);

  // 4. Insert Games and PlayerStats
  if (Array.isArray(dataset.games)) {
    for (const g of dataset.games) {
      const [insertedGame] = await db
        .insert(games)
        .values({
          teamId,
          opponent: g.opponent,
          round: g.round,
          date: g.date,
          status: g.status,
          resultC1: g.resultC1 ?? 0,
          resultC2: g.resultC2 ?? 0,
          resultC3: g.resultC3 ?? 0,
          resultC4: g.resultC4 ?? 0,
          resultExtra: g.resultExtra ?? 0,
          resultC1Opponent: g.resultC1Opponent ?? 0,
          resultC2Opponent: g.resultC2Opponent ?? 0,
          resultC3Opponent: g.resultC3Opponent ?? 0,
          resultC4Opponent: g.resultC4Opponent ?? 0,
          resultExtraOpponent: g.resultExtraOpponent ?? 0,
          foulsC1: g.foulsC1 ?? 0,
          foulsC2: g.foulsC2 ?? 0,
          foulsC3: g.foulsC3 ?? 0,
          foulsC4: g.foulsC4 ?? 0,
          foulsExtra: g.foulsExtra ?? 0,
          foulsC1Opponent: g.foulsC1Opponent ?? 0,
          foulsC2Opponent: g.foulsC2Opponent ?? 0,
          foulsC3Opponent: g.foulsC3Opponent ?? 0,
          foulsC4Opponent: g.foulsC4Opponent ?? 0,
          foulsExtraOpponent: g.foulsExtraOpponent ?? 0,
        })
        .returning();

      totalGamesCount++;
      if (g.status === "finished") {
        finishedGamesCount++;
      } else if (g.status === "pending") {
        pendingGamesCount++;
      }

      // Insert associated player stats if any
      if (Array.isArray(g.playerStats)) {
        for (const stat of g.playerStats) {
          const playerId = playerMap.get(stat.playerNumber);
          if (!playerId) {
            throw new Error(
              `Player number ${stat.playerNumber} not found in seeded roster for game vs ${g.opponent}`
            );
          }

          await db.insert(playerStats).values({
            gameId: insertedGame.id,
            playerId,
            minutes: stat.minutes,
            t1a: stat.t1a,
            t1i: stat.t1i,
            t2a: stat.t2a,
            t2i: stat.t2i,
            t3a: stat.t3a,
            t3i: stat.t3i,
            oreb: stat.oreb,
            dreb: stat.dreb,
            asis: stat.asis,
            rec: stat.rec,
            per: stat.per,
            falt: stat.falt,
            valuation: stat.valuation,
          });

          totalPlayerStatsCount++;
        }
      }
    }
  }

  console.log(`   📅 Inserted ${totalGamesCount} matches (${finishedGamesCount} finished, ${pendingGamesCount} pending).`);
  console.log(`   📊 Inserted ${totalPlayerStatsCount} player stat box scores.`);
  console.log("🎉 Database seeding completed successfully!");
  console.log(
    `📊 Summary: 1 Team | ${totalPlayersCount} Players | ${totalGamesCount} Games | ${totalPlayerStatsCount} Player Stats`
  );

  return {
    teamsCount: 1,
    playersCount: totalPlayersCount,
    gamesCount: totalGamesCount,
    finishedGamesCount,
    pendingGamesCount,
    playerStatsCount: totalPlayerStatsCount,
  };
}

export default seedDatabase;

if (typeof require !== "undefined" && (require as any).main === (typeof module !== "undefined" ? (module as any) : undefined)) {
  seedDatabase()
    .then((summary) => {
      console.log("Seeding summary result:", JSON.stringify(summary, null, 2));
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

