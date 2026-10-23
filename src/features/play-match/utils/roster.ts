import { InGamePlayer } from "../types";

/**
 * Builds the active match roster by filtering team players to only those called up
 * in existing playerStats. If existingStats is empty (e.g. legacy match without declared
 * roster), gracefully falls back to all team players.
 */
export function buildMatchRoster(
  teamPlayers: any[],
  existingStats: any[]
): InGamePlayer[] {
  const calledUpIds = new Set((existingStats || []).map((s: any) => s.playerId));
  const activePlayers =
    existingStats && existingStats.length > 0
      ? (teamPlayers || []).filter((p: any) => calledUpIds.has(p.id))
      : (teamPlayers || []);

  return activePlayers.map((p: any) => {
    const stat = (existingStats || []).find((s: any) => s.playerId === p.id);
    return {
      id: p.id,
      firstName: p.firstName || p.first_name || "Jugador",
      lastName: p.lastName || p.last_name || `#${p.number}`,
      number: String(p.number || "0"),
      position: p.position || null,
      isOnCourt: false,
      courtPositionIndex: null,
      secondsPlayed: (stat?.minutes || 0) * 60,
      t1a: stat?.t1a || 0,
      t1i: stat?.t1i || 0,
      t2a: stat?.t2a || 0,
      t2i: stat?.t2i || 0,
      t3a: stat?.t3a || 0,
      t3i: stat?.t3i || 0,
      oreb: stat?.oreb || 0,
      dreb: stat?.dreb || 0,
      asis: stat?.asis || 0,
      rec: stat?.rec || 0,
      per: stat?.per || 0,
      falt: stat?.falt || 0,
      valuation: stat?.valuation || 0,
    };
  });
}
