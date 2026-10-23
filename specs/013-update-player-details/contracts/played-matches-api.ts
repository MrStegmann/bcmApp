/**
 * Contract: Played Matches & Player Detail Navigation Interfaces
 * Defines the public interfaces for the played matches list and match detail drilldown.
 */

import { PlayedMatchContract } from "./player-api";

export interface PlayerDetailProps {
  data: {
    id: number;
    firstName?: string;
    first_name?: string;
    lastName?: string;
    last_name?: string;
    number?: string | number;
    jerseyName?: string | null;
    jersey_name?: string | null;
    [key: string]: any;
  };
  onReturn?: () => void;
}

export interface PlayedMatchItemProps {
  match: PlayedMatchContract;
  onOpenMatch: (gameId: number) => void;
}

export interface PlayedMatchesListProps {
  matches: PlayedMatchContract[];
  onOpenMatch: (gameId: number) => void;
  isLoading?: boolean;
}
