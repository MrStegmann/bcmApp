export interface Player {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  nationality?: string;
  phoneNumber?: string;
  email?: string;
  isActive: boolean; // Indicate if the player can be selected for matches
  jerseyNumber: number;
  jerseyName: string;
}

export interface PlayerStats {
  playerId: string;
  gameId?: string | null; // Optional, as stats can be aggregated across matches
  minutes: number;
  t1a: number; // Free throw made
  t1i: number; // Free throws attemps
  t2a: number; // Two-point made
  t2i: number; // Two-point attempts
  t3a: number; // Three-point made
  t3i: number; // Three-point attempts
  dreb: number; // Defensive rebounds
  oreb: number; // Offensive rebounds
  asis: number; // Assists
  rec: number; // Recoveries
  per: number; // Ball losses
  falt: number; // Fouls
}

export interface PlayerListItem {
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  jerseyName: string;
  isActive: boolean;
}
