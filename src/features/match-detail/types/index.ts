import type { Game } from "../../../types/database";

export type PeriodId = "q1" | "q2" | "q3" | "q4" | "extra";

export interface PeriodBreakdownItem {
  id: PeriodId;
  label: string; // "Period 1", "Period 2", "Period 3", "Period 4", "Extra"
  teamPoints: number;
  teamFouls: number;
  rivalPoints: number;
  rivalFouls: number;
  isExtra: boolean;
}

export interface PlayerRosterItem {
  id: number; // player ID
  statId: number; // player_stats ID
  jerseyNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  minutes: number;
  seconds?: number;
  points: number; // t1a * 1 + t2a * 2 + t3a * 3
  valuation: number;

  // Detailed Box Score Counts
  t1a: number; // 1pt made
  t1i: number; // 1pt attempted
  t2a: number; // 2pt made
  t2i: number; // 2pt attempted
  t3a: number; // 3pt made
  t3i: number; // 3pt attempted
  oreb: number; // offensive rebounds
  dreb: number; // defensive rebounds
  totalRebounds: number; // oreb + dreb
  asis: number; // assists
  rec: number; // steals
  per: number; // turnovers
  falt: number; // fouls committed
}

export interface AdvancedTeamStats {
  posesiones: number; // Posesiones (total)
  oer: number; // Offensive Efficiency Rating
  der: number; // Defensive Efficiency Rating
  efg: number; // Effective Field Goal Percentage (%)
  orb: number; // Offensive Rebound Percentage (%)
  ast: number; // Assist Percentage (%)
  tov: number; // Turnover Percentage (%)
  ftr: number; // Free Throw Rate (%)
}

export interface AdvancedMetricDefinition {
  key: keyof AdvancedTeamStats;
  name: string;
  label: string;
  format: "number" | "percent";
  unit: string;
  description: string;
}

export interface RadarAxis {
  key: keyof AdvancedTeamStats;
  label: string;
  formattedValue: string;
  angleDeg: number;
  rawValue: number;
  normalizedValue: number; // 0.0 to 1.0 scale
  x: number;
  y: number;
}

export interface RadarPolygonData {
  axes: RadarAxis[];
  polygonPointsSvg: string; // "x1,y1 x2,y2 ... x8,y8"
  gridPolygons: string[]; // SVG points for concentric 25%, 50%, 75%, 100% webs
}

export interface MatchEditBuffer {
  periods: Record<
    PeriodId,
    {
      teamPoints: number;
      teamFouls: number;
      rivalPoints: number;
      rivalFouls: number;
    }
  >;
  players: Record<
    number,
    {
      minutes: number;
      seconds?: number;
      t1a: number;
      t1i: number;
      t2a: number;
      t2i: number;
      t3a: number;
      t3i: number;
      oreb: number;
      dreb: number;
      asis: number;
      rec: number;
      per: number;
      falt: number;
    }
  >;
}

export interface RawTeamTotals {
  totalPoints: number;
  totalRivalPoints: number;
  t1a: number;
  t1i: number;
  t2a: number;
  t2i: number;
  t3a: number;
  t3i: number;
  oreb: number;
  dreb: number;
  asis: number;
  rec: number;
  per: number;
  falt: number;
}

// Component Prop Contracts
export interface MatchDetailViewProps {
  match: Game;
  onReturn: () => void;
  onMatchUpdated?: (updatedMatch: Game) => void;
}

export interface MatchSummaryHeaderProps {
  teamName: string;
  opponentName: string;
  date: string;
  status?: string;
  totalTeamPoints?: number;
  totalRivalPoints?: number;
  onReturn?: () => void;
  onOpenEdit?: () => void;
  onShareStats?: () => void;
}

export interface PeriodBreakdownTableProps {
  periods: PeriodBreakdownItem[];
  totalTeamPoints: number;
  totalRivalPoints: number;
  totalTeamFouls: number;
  totalRivalFouls: number;
}

export interface RosterValuationListProps {
  players: PlayerRosterItem[];
  onSelectPlayer: (player: PlayerRosterItem) => void;
}

export interface PlayerDetailModalProps {
  visible: boolean;
  player: PlayerRosterItem | null;
  onClose: () => void;
}

export interface TeamAdvancedAnalyticsProps {
  stats: AdvancedTeamStats;
}

export interface PolygonRadarChartProps {
  stats: AdvancedTeamStats;
  size?: number;
}

export interface MatchEditModalProps {
  visible: boolean;
  initialMatch: Game;
  initialPlayers: PlayerRosterItem[];
  onSave: (buffer: MatchEditBuffer) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

// Store State & Actions
export interface MatchDetailState {
  match: Game | null;
  teamName: string;
  periods: PeriodBreakdownItem[];
  players: PlayerRosterItem[];
  advancedStats: AdvancedTeamStats;
  selectedPlayer: PlayerRosterItem | null;
  isEditModalOpen: boolean;
  isShareModalOpen: boolean;
  isSharingProcessing: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  initializeMatch: (match: Game) => Promise<void>;
  selectPlayer: (player: PlayerRosterItem | null) => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  saveMatchEdits: (buffer: MatchEditBuffer) => Promise<void>;
  openShareModal: () => void;
  closeShareModal: () => void;
  setSharingProcessing: (isProcessing: boolean) => void;
}

export * from "./share";
