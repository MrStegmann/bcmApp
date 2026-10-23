import {
  MockTeamDatasetConfig,
  ValidationResult,
  MockPlayerStatConfig,
  MockGameConfig,
} from "../../types/mockData";
import { calculatePlayerValuation } from "../../store/GameStore";

export const TIMESTAMP_REGEX = /^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/;

/**
 * Validates a mock dataset against structural, relational, and mathematical rules.
 */
export function validateDataset(dataset: MockTeamDatasetConfig): ValidationResult {
  const errors: string[] = [];

  if (!dataset) {
    return { isValid: false, errors: ["Dataset is null or undefined"] };
  }

  // 1. Team validations
  if (!dataset.name || dataset.name.trim() === "") {
    errors.push("Team name is required");
  }

  // 2. Roster validations
  if (!Array.isArray(dataset.players) || dataset.players.length < 12) {
    errors.push(
      `Team roster must have at least 12 players (found ${dataset.players ? dataset.players.length : 0}, fewer than 12)`
    );
  }

  const seenNumbers = new Set<string>();
  const rosterNumbers = new Set<string>();
  if (Array.isArray(dataset.players)) {
    for (const player of dataset.players) {
      if (!player.number || player.number.trim() === "") {
        errors.push(`Player ${player.firstName} ${player.lastName} has no jersey number`);
      } else {
        if (seenNumbers.has(player.number)) {
          errors.push(`Found duplicate jersey number "${player.number}" in roster`);
        }
        seenNumbers.add(player.number);
        rosterNumbers.add(player.number);
      }
    }
  }

  // 3. Games count validations
  if (!Array.isArray(dataset.games) || dataset.games.length !== 10) {
    errors.push(`Dataset must define exactly 10 matches (found ${dataset.games ? dataset.games.length : 0})`);
  }

  let finishedCount = 0;
  let pendingCount = 0;

  if (Array.isArray(dataset.games)) {
    dataset.games.forEach((game, gameIdx) => {
      const gameRef = `Match #${gameIdx + 1} (${game.opponent})`;

      if (game.status === "finished") {
        finishedCount++;
      } else if (game.status === "pending") {
        pendingCount++;
      } else {
        errors.push(`${gameRef}: Invalid status "${game.status}"`);
      }

      // Date format check
      if (!game.date || !TIMESTAMP_REGEX.test(game.date)) {
        errors.push(`${gameRef}: Invalid date format "${game.date}", expected "DD/MM/YYYY - HH:MM"`);
      }

      // Finished game checks
      if (game.status === "finished") {
        const teamScore =
          Number(game.resultC1 || 0) +
          Number(game.resultC2 || 0) +
          Number(game.resultC3 || 0) +
          Number(game.resultC4 || 0) +
          Number(game.resultExtra || 0);

        const oppScore =
          Number(game.resultC1Opponent || 0) +
          Number(game.resultC2Opponent || 0) +
          Number(game.resultC3Opponent || 0) +
          Number(game.resultC4Opponent || 0) +
          Number(game.resultExtraOpponent || 0);

        // Check overtime consistency
        const regularTeam =
          Number(game.resultC1 || 0) +
          Number(game.resultC2 || 0) +
          Number(game.resultC3 || 0) +
          Number(game.resultC4 || 0);
        const regularOpp =
          Number(game.resultC1Opponent || 0) +
          Number(game.resultC2Opponent || 0) +
          Number(game.resultC3Opponent || 0) +
          Number(game.resultC4Opponent || 0);

        const hasOvertime = Number(game.resultExtra || 0) > 0 || Number(game.resultExtraOpponent || 0) > 0;
        if (hasOvertime && regularTeam !== regularOpp) {
          errors.push(
            `${gameRef}: Game has overtime (${game.resultExtra}-${game.resultExtraOpponent}) but regular scores were not tied (${regularTeam}-${regularOpp})`
          );
        }

        // Box score validations
        if (!Array.isArray(game.playerStats) || game.playerStats.length === 0) {
          errors.push(`${gameRef}: Finished game missing player box score stats`);
        } else {
          let sumPlayerPoints = 0;

          game.playerStats.forEach((stat, statIdx) => {
            const statRef = `${gameRef} - player #${stat.playerNumber} (stat #${statIdx + 1})`;

            // Check player exists in roster
            if (!rosterNumbers.has(stat.playerNumber)) {
              errors.push(`${statRef}: Jersey number "${stat.playerNumber}" not found in team roster`);
            }

            // Shot feasibility
            if (stat.t1a > stat.t1i) {
              errors.push(`${statRef}: Free throws made (${stat.t1a}) exceed attempted (${stat.t1i})`);
            }
            if (stat.t2a > stat.t2i) {
              errors.push(`${statRef}: 2PT field goals made (${stat.t2a}) exceed attempted (${stat.t2i})`);
            }
            if (stat.t3a > stat.t3i) {
              errors.push(`${statRef}: 3PT field goals made (${stat.t3a}) exceed attempted (${stat.t3i})`);
            }

            // DNP check
            if (stat.minutes === 0) {
              const hasStats =
                stat.t1a !== 0 ||
                stat.t1i !== 0 ||
                stat.t2a !== 0 ||
                stat.t2i !== 0 ||
                stat.t3a !== 0 ||
                stat.t3i !== 0 ||
                stat.oreb !== 0 ||
                stat.dreb !== 0 ||
                stat.asis !== 0 ||
                stat.rec !== 0 ||
                stat.per !== 0 ||
                stat.falt !== 0 ||
                stat.valuation !== 0;

              if (hasStats) {
                errors.push(`${statRef}: DNP player (0 minutes) must have 0 in all statistical categories`);
              }
            }

            // Valuation check
            const expectedValuation = calculatePlayerValuation(stat);
            if (stat.valuation !== expectedValuation) {
              errors.push(
                `${statRef}: Recorded valuation (${stat.valuation}) does not match calculated valuation formula (${expectedValuation})`
              );
            }

            const playerPoints = stat.t1a * 1 + stat.t2a * 2 + stat.t3a * 3;
            sumPlayerPoints += playerPoints;
          });

          // Points reconciliation check
          if (sumPlayerPoints !== teamScore) {
            errors.push(
              `${gameRef}: Match points reconciliation failed. Team score is ${teamScore}, but sum of player points is ${sumPlayerPoints}`
            );
          }
        }
      }
    });

    if (finishedCount !== 5 || pendingCount !== 5) {
      errors.push(
        `Schedule must contain exactly 5 finished and 5 pending matches (found ${finishedCount} finished, ${pendingCount} pending)`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
