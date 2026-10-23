import { PlayedMatchContract } from "../../specs/013-update-player-details/contracts/player-api";

export const EMPTY_PLAYED_MATCHES_MESSAGE =
  "Este jugador aún no ha participado en ningún partido.";

export interface FormattedPlayedMatch {
  gameId: number;
  opponent: string;
  opponentDisplay: string;
  round: string;
  roundDisplay: string;
  date: string;
  status: string;
  scoreDisplay?: string;
}

/**
 * Formats a played match summary for display in PlayerDetail cards.
 */
export function formatPlayedMatch(match: PlayedMatchContract): FormattedPlayedMatch {
  const roundStr = match.round ? String(match.round).trim() : "1";
  const roundDisplay =
    roundStr.toLowerCase().startsWith("jornada") || roundStr.toLowerCase().startsWith("ronda")
      ? roundStr
      : `Jornada ${roundStr}`;

  const opp = match.opponent ? match.opponent.trim() : "Rival";
  const opponentDisplay = opp.startsWith("vs ") ? opp : `vs ${opp}`;

  let scoreDisplay: string | undefined = undefined;
  if (match.status === "finished") {
    const teamTotal =
      (match.resultC1 || 0) +
      (match.resultC2 || 0) +
      (match.resultC3 || 0) +
      (match.resultC4 || 0) +
      (match.resultExtra || 0);
    const oppTotal =
      (match.resultC1Opponent || 0) +
      (match.resultC2Opponent || 0) +
      (match.resultC3Opponent || 0) +
      (match.resultC4Opponent || 0) +
      (match.resultExtraOpponent || 0);
    scoreDisplay = `${teamTotal} - ${oppTotal}`;
  }

  return {
    gameId: match.gameId,
    opponent: opp,
    opponentDisplay,
    round: roundStr,
    roundDisplay,
    date: match.date || "",
    status: match.status || "pending",
    scoreDisplay,
  };
}
