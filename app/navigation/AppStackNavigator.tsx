import React, { useCallback, useEffect } from "react";
import { useAuthStore } from "../features/login";
import { PrivateStack } from "./stacks/PrivateStack";
import { PublicStack } from "./stacks/PublicStack";
import { useTeamStore } from "../features/teams";
import { TeamStack } from "./stacks/TeamStack";

const RootNavigator = () => {
  const auth = useAuthStore((state) => state.auth);
  const team = useTeamStore((state) => state.team);

  const loadStack = useCallback(() => {
    if (auth) {
      if (team) {
        return <TeamStack />;
      }
      return <PrivateStack />;
    }
    return <PublicStack />;
  }, [auth, team]);

  return (
    <>
      {loadStack()}
    </>
  );
};

export const AppStackNavigator = () => {
  return <RootNavigator />;
};
