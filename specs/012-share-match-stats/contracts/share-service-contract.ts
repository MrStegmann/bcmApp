/**
 * Contracts for Match Stats Graphic Export & Sharing
 * Feature: 012-share-match-stats
 */

import type { Game } from "../../../src/types/database";
import type {
  PeriodBreakdownItem,
  PlayerRosterItem,
  AdvancedTeamStats,
} from "../../../src/features/match-detail/types";

// ============================================================================
// 1. Data Contracts for Graphic Rendering
// ============================================================================

export interface FormattedPlayerBoxScore {
  jerseyNumber: string;
  playerName: string;
  minutes: number;
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
// 2. Component Props Contracts
// ============================================================================

export interface MatchStatsGraphicProps {
  data: MatchShareGraphicData;
  /**
   * Ref forwarded for captureRef
   */
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
// 3. Service & Action Contracts
// ============================================================================

export type ShareActionOutcome =
  | { success: true; message: string; uri?: string }
  | { success: false; error: string; permissionDenied?: boolean };

export interface MatchShareServiceContract {
  /**
   * Captures the given View ref to a high-resolution PNG file.
   * @param viewRef React ref pointing to the graphic view.
   * @returns Temporary file URI string (file://...)
   */
  captureViewToPng: (viewRef: React.RefObject<any>) => Promise<string>;

  /**
   * Shares the generated PNG file using the platform's native share sheet.
   * @param fileUri Local file URI of the PNG image.
   * @param dialogTitle Title shown in system share dialog.
   */
  shareImageFile: (fileUri: string, dialogTitle?: string) => Promise<ShareActionOutcome>;

  /**
   * Saves the generated PNG file directly to the device photo library.
   * Requests user permission if not already granted.
   * @param fileUri Local file URI of the PNG image.
   */
  saveImageToGallery: (fileUri: string) => Promise<ShareActionOutcome>;
}
