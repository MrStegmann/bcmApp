/**
 * GameCards Component & 2-Column Action Grid Contract
 * Feature: 017-set-completed-match
 */

import { Game } from "../../../src/types/database";

export interface UpdatedGameCardsProps {
  /**
   * List of games to display
   */
  games: Game[];

  /**
   * Handler for tapping a game card to view detail or start match
   */
  onSelect: (game: Game) => void;

  /**
   * Handler for editing game metadata (rival, date, round)
   */
  onEdit: (game: Game) => void;

  /**
   * Handler for deleting game
   */
  onDelete: (game: Game) => void;

  /**
   * Handler for opening roster selection
   */
  onSelectRoster?: (game: Game) => void;

  /**
   * NEW: Handler for direct match result completion
   * Triggered when tapping the "Set Result" action button
   */
  onSetResult?: (game: Game) => void;
}

export interface GameCardActionGridProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  onSelectRoster?: (game: Game) => void;
  onSetResult?: (game: Game) => void;
}

/**
 * Grid layout specification:
 * - Container: `flex flex-row flex-wrap w-[100px] justify-end items-center gap-1.5 pl-2 border-l border-slate-border`
 * - Each button: `min-w-[42px] min-h-[42px] p-2 items-center justify-center rounded-lg bg-slate-dark`
 * - Column count: Exactly 2 buttons per row (2 columns)
 * - Row 1: Roster (`Feather: users`) | Set Result (`Feather: check-square`)
 * - Row 2: Edit (`Feather: edit`) | Delete (`Feather: trash`)
 *
 * Conditional Rules:
 * - "Set Result" button: Enabled strictly when `game.status === 'pending'` or `!game.status`.
 *   When `inProgress` or `finished`: Hidden or rendered with `opacity-30` and `disabled={true}`.
 */
