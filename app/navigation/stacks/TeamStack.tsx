import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PrivateRouteLayout } from "../layouts/PrivateRouteLayout";
import { AppRoutes, AppStackParamList } from "../types";
import { TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TeamScreen, useTeamStore } from "../../features/teams";
import {
  PlayerDetailScreen,
  PlayerFormScreen,
  PlayersListScreen,
} from "../../features/players";
import {
  useNavigationStore as useNavigator,
  NavigationItem,
} from "../../shared/hooks/useNavigationStore";
import { useAppNavigation, useProcessPendingNavigation } from "../../shared/hooks/useAppNavigation";
import { GameListScreen, GameDetailScreen, GameFormScreen, GameRosterScreen, GamePlayMatchScreen } from "../../features/games";

import { useRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator<AppStackParamList>();

const BackHeaderButton = () => {
  const setTeam = useTeamStore((state) => state.setTeam);
  const { navigate, goBack } = useAppNavigation();
  const route = useRoute();

  return (
    <TouchableOpacity
      className="w-10 h-10 items-center justify-center"
      onPress={() => {
        if (route.name === AppRoutes.TeamDetail) {
          navigate(AppRoutes.Teams);
        } else {
          goBack();
        }
      }}
    >
      <View className="w-full h-full flex items-center justify-center z-10">
        <FontAwesome5 name="arrow-left" size={15} color="black" />
      </View>
    </TouchableOpacity>
  );
};

const TeamStack = () => {
  const team = useTeamStore((state) => state.team);
  const setNavigationItems = useNavigator((state) => state.setNavigationItems);
  const navigationItems: NavigationItem[] = [];
  useProcessPendingNavigation();
  useEffect(() => {
    if (team) {
      navigationItems.push(
        {
          label: "Home",
          path: AppRoutes.TeamDetail,
          icon: <FontAwesome5 name="home" size={17} color="black" />,
        },
        {
          label: "Jugadores",
          path: AppRoutes.Players,
          icon: <FontAwesome5 name="users" size={17} color="black" />,
        },
        {
          label: "Partidos",
          path: AppRoutes.Games,
          icon: <FontAwesome5 name="trophy" size={17} color="black" />,
        },
      );
      setNavigationItems(navigationItems);
    }
  }, [team]);
  return (
    <Stack.Navigator
      id={undefined}
      screenLayout={PrivateRouteLayout}
      screenOptions={{
        headerLeft: BackHeaderButton,
        headerTitleAlign: "center",
        headerTitle: team ? team.name : "Equipo",
      }}
    >
      <Stack.Screen component={TeamScreen} name={AppRoutes.TeamDetail} />
      <Stack.Screen component={PlayersListScreen} name={AppRoutes.Players} />
      <Stack.Screen component={PlayerFormScreen} name={AppRoutes.PlayerForm} />
      <Stack.Screen
        component={PlayerDetailScreen}
        name={AppRoutes.PlayerDetail}
      />
      <Stack.Screen component={GameListScreen} name={AppRoutes.Games} />
      <Stack.Screen component={GameDetailScreen} name={AppRoutes.GameDetail} />
      <Stack.Screen component={GameFormScreen} name={AppRoutes.GameForm} />
      <Stack.Screen component={GameRosterScreen} name={AppRoutes.GameRoster} />
      <Stack.Screen component={GamePlayMatchScreen} name={AppRoutes.GamePlayMatch} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export { TeamStack };
