import { Team, NewTeam } from "../../../src/types/database";

/**
 * UI Component Props Contract for Club Manager View Page & Components
 */

export interface ClubManageProps {
  onSelectTeam?: (team: Team) => void;
}

export interface ClubListProps {
  teams: Team[];
  onSelectTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
  onCreateTeam: () => void;
}

export interface ClubFormProps {
  onSubmit: (data: NewTeam) => void | Promise<void>;
  initialData?: Team | null;
  onCancel?: () => void;
}

export interface ClubProfileProps {
  team: Team;
  onReturn: () => void;
  onUpdate: (data: Partial<NewTeam>) => void | Promise<void>;
}
