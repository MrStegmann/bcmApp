import { Exercise } from "../features/exercises";
import { Game } from "../features/games";
import { Player } from "../features/players";
import { Team } from "../features/teams";
import { User } from "../features/users/types";

export const AppRoutes = {
  Login: "Login",
  Home: "Home",
  Users: "Users",
  UserForm: "UserForm",
  UserDetail: "UserDetail",
  Teams: "Teams",
  TeamForm: "TeamForm",
  TeamDetail: "TeamDetail",
  Exercises: "Exercises",
  ExerciseForm: "ExerciseForm",
  ExerciseDetail: "ExerciseDetail",
  Players: "Players",
  PlayerForm: "PlayerForm",
  PlayerDetail: "PlayerDetail",
  Games: "Games",
  GameForm: "GameForm",
  GameDetail: "GameDetail",
  GameRoster: "GameRoster",
} as const;

export type AppStackParamList = {
  [AppRoutes.Login]: undefined;
  [AppRoutes.Home]: undefined;
  [AppRoutes.Users]: undefined;
  [AppRoutes.UserForm]:
  | {
    user?: User;
  }
  | undefined;
  [AppRoutes.UserDetail]: {
    user: User;
  };
  [AppRoutes.Teams]: undefined;
  [AppRoutes.TeamForm]:
  | {
    team?: Team;
  }
  | undefined;
  [AppRoutes.TeamDetail]: undefined;
  [AppRoutes.Exercises]: undefined;
  [AppRoutes.ExerciseForm]:
  | {
    exercise?: Exercise;
  }
  | undefined;
  [AppRoutes.ExerciseDetail]: {
    exercise: Exercise;
  };
  [AppRoutes.Players]: undefined;
  [AppRoutes.PlayerForm]:
  | {
    player?: Player;
  }
  | undefined;
  [AppRoutes.PlayerDetail]: {
    player: Player;
  };
  [AppRoutes.Games]: undefined;
  [AppRoutes.GameForm]:
  | {
    game?: Game;
  }
  | undefined;
  [AppRoutes.GameDetail]: {
    game: Game;
  };
  [AppRoutes.GameRoster]: {
    gameId: string;
  };
};
