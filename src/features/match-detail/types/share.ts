import type { Game } from "../../../types/database";
import type {
  PeriodBreakdownItem,
  PlayerRosterItem,
  AdvancedTeamStats,
} from "./index";

// ============================================================================
// Data Contracts for Graphic Rendering
// ============================================================================

export interface FormattedPlayerBoxScore {
  jerseyNumber: string;
  playerName: string;
  minutes: number;
  seconds?: number;
  pts: number;
  t2a: number;
  t2i: number;
  t2p: string; // e.g. "50%"
  t3a: number;
  t3i: number;
  t3p: string; // e.g. "33%"
  t1a: number;
  t1i: number;
  t1p: string; // e.g. "80%"
  dreb: number;
  oreb: number;
  treb: number;
  asis: number;
  rec: number;
  per: number;
  tapF: number;
  tapC: number;
  falt: number;
  faltR: number;
  val: number;
}

export interface FormattedTeamTotals {
  label: "EQUIPO";
  minutes: number;
  pts: number;
  t2a: number;
  t2i: number;
  t2p: string;
  t3a: number;
  t3i: number;
  t3p: string;
  t1a: number;
  t1i: number;
  t1p: string;
  dreb: number;
  oreb: number;
  treb: number;
  asis: number;
  rec: number;
  per: number;
  tapF: number;
  tapC: number;
  falt: number;
  faltR: number;
  val: number;
}

export interface FormattedPeriodScore {
  period: string; // "C1", "C2", "C3", "C4", "Extra", "Final"
  homeScore: number;
  rivalScore: number;
}

export interface FormattedAdvancedStats {
  posesiones: string;
  oer: string;
  der: string;
  efg: string;
  orb: string;
  ast: string;
  tov: string;
  tlr: string;
}

export interface MatchShareGraphicData {
  homeTeamName: string;
  rivalTeamName: string;
  roundAndDate: string; // e.g. "Jornada 4 - 23/10/2026"
  players: FormattedPlayerBoxScore[];
  totals: FormattedTeamTotals;
  periods: FormattedPeriodScore[];
  advancedStats: FormattedAdvancedStats;
}

// ============================================================================
// Component Props Contracts
// ============================================================================

export interface MatchStatsGraphicProps {
  data: MatchShareGraphicData;
  captureRefTarget?: React.RefObject<any>;
}

export interface MatchShareModalProps {
  visible: boolean;
  match: Game;
  teamName: string;
  periods: PeriodBreakdownItem[];
  players: PlayerRosterItem[];
  advancedStats: AdvancedTeamStats;
  onClose: () => void;
}

// ============================================================================
// Service & Action Contracts
// ============================================================================

export type ShareActionOutcome =
  | { success: true; message: string; uri?: string }
  | { success: false; error: string; permissionDenied?: boolean };

export interface MatchShareServiceContract {
  captureViewToPng: (viewRef: React.RefObject<any>, customFileName?: string) => Promise<string>;
  shareImageFile: (
    fileUri: string,
    dialogTitle?: string,
    customFileName?: string
  ) => Promise<ShareActionOutcome>;
  saveImageToGallery: (fileUri: string, customFileName?: string) => Promise<ShareActionOutcome>;
}
