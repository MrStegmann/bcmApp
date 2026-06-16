export type Team = {
  id: string;
  name: string;
  coachId: string;
  assistantCoachIds: string[];
  staffIds: string[];
  competition: string;
  category: string;
};

export type TeamsFormParams = {
  team?: Team;
};
