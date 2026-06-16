import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../../features/login";
import { PrivateRouteLayout } from "../layouts/PrivateRouteLayout";
import { AppRoutes, AppStackParamList } from "../types";
import { HomeScreen } from "../../features/home";
import {
  useNavigationStore as useNavigator,
  NavigationItem,
} from "../../shared/hooks/useNavigationStore";
import { useProcessPendingNavigation } from "../../shared/hooks/useAppNavigation";
import {
  UserDetailScreen,
  UserFormScreen,
  UsersListScreen,
} from "../../features/users";
import { TeamFormScreen, TeamsListScreen } from "../../features/teams";
import { TouchableOpacity, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import ExerciseListScreen from "../../features/exercises/screens/ExerciseListScreen";
import {
  ExerciseDetailScreen,
  ExerciseFormScreen,
} from "../../features/exercises";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { usePlaygroundStore } from "../../features/exercises/store/usePlaygroundStore";

const iconSize = 17;
const Stack = createNativeStackNavigator<AppStackParamList>();

type LogoutHeaderButtonProps = {
  onLogout: () => void;
};

const LogoutHeaderButton = ({ onLogout }: LogoutHeaderButtonProps) => (
  <TouchableOpacity
    className="w-10 h-10 items-center justify-center"
    onPress={onLogout}
  >
    <View className="w-full h-full flex items-center justify-center z-10">
      <FontAwesome5 name="power-off" size={15} color="red" />
    </View>
  </TouchableOpacity>
);

const PrivateStackHeaderRight = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return <LogoutHeaderButton onLogout={clearAuth} />;
};

const ExerciseHeaderLeftButton = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const route = useRoute();
  const isEditing = usePlaygroundStore((state) => state.isEditing);
  const setIsEditing = usePlaygroundStore((state) => state.setIsEditing);
  const showButton = isEditing || route.name === AppRoutes.ExerciseDetail
  if (!showButton) return <TouchableOpacity
    className="w-10 h-10 items-center justify-center"
    onPress={() => {
      navigation.goBack()
    }}
  >
    <View className="w-full h-full flex items-center justify-center z-10">
      <FontAwesome5 name="arrow-left" size={15} color="black" />
    </View>
  </TouchableOpacity>
  return (
    <TouchableOpacity
      className="w-10 h-10 items-center justify-center"
      onPress={() => {
        setIsEditing(false)
        navigation.navigate(AppRoutes.Exercises)
      }}
    >
      <View className="w-full h-full flex items-center justify-center z-10">
        <FontAwesome5 name="arrow-left" size={15} color="black" />
      </View>
    </TouchableOpacity>
  );
};


const PrivateStack = () => {
  const authRole = useAuthStore((state) => state.auth?.role);
  const setNavigationItems = useNavigator((state) => state.setNavigationItems);
  const navigationItems: NavigationItem[] = [];
  const { currentBoardIndex, boards } = usePlaygroundStore();
  useProcessPendingNavigation();
  useEffect(() => {
    if (["root", "admin", "adminassistant"].includes(authRole || "")) {
      // Set navigation items for root
      // TODO:
      // 1. Añadir rutas para listar, crear, actualizar y eliminar ejercicios.
      // 2. Ruta para gestionar el Club.
      // 3. Ruta para gestionar perfil.
      navigationItems.push(
        {
          label: "Inicio",
          path: AppRoutes.Home,
          icon: <FontAwesome5 name="home" size={iconSize} color="black" />,
        },
        {
          label: "Usuarios",
          path: AppRoutes.Users,
          icon: <FontAwesome5 name="users" size={iconSize} color="black" />,
        },
        {
          label: "Equipos",
          path: AppRoutes.Teams,
          icon: (
            <FontAwesome5 name="shield-alt" size={iconSize} color="black" />
          ),
        },
        {
          label: "Ejercicios",
          path: AppRoutes.Exercises,
          icon: <FontAwesome5 name="dumbbell" size={iconSize} color="black" />,
        },
      );
    } else if (authRole === "coach") {
      // Set navigation items for coach
      // TODO:
      // 1. Añadir rutas para listar, crear, actualizar y eliminar ejercicios.
      // 2. Ruta para gestionar perfil.
      navigationItems.push(
        {
          label: "Inicio",
          path: AppRoutes.Home,
          icon: <FontAwesome5 name="home" size={iconSize} color="black" />,
        },
        {
          label: "Equipos",
          path: AppRoutes.Teams,
          icon: (
            <FontAwesome5 name="shield-alt" size={iconSize} color="black" />
          ),
        },
        {
          label: "Ejercicios",
          path: AppRoutes.Exercises,
          icon: <FontAwesome5 name="dumbbell" size={iconSize} color="black" />,
        },
      );
    }

    setNavigationItems(navigationItems);
  }, [authRole]);
  return (
    <Stack.Navigator
      id={undefined}
      screenLayout={PrivateRouteLayout}
      screenOptions={{
        headerRight: PrivateStackHeaderRight,
        headerLeft: ExerciseHeaderLeftButton,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        component={HomeScreen}
        name={AppRoutes.Home}
        options={{ headerTitle: "Inicio" }}
      />
      <Stack.Screen
        component={UsersListScreen}
        name={AppRoutes.Users}
        options={{ headerTitle: "Miembros" }}
      />
      <Stack.Screen
        component={UserFormScreen}
        name={AppRoutes.UserForm}
        options={{ headerTitle: "Formulario de Miembros" }}
      />
      <Stack.Screen
        component={UserDetailScreen}
        name={AppRoutes.UserDetail}
        options={{ headerTitle: "Detalle de Miembro" }}
      />

      <Stack.Screen
        component={TeamsListScreen}
        name={AppRoutes.Teams}
        options={{ headerTitle: "Equipos" }}
      />
      <Stack.Screen
        component={TeamFormScreen}
        name={AppRoutes.TeamForm}
        options={{ headerTitle: "Formulario de Equipo" }}
      />

      <Stack.Screen
        component={ExerciseListScreen}
        name={AppRoutes.Exercises}
        options={{ headerTitle: "Ejercicios" }}
      />
      <Stack.Screen
        component={ExerciseFormScreen}
        name={AppRoutes.ExerciseForm}
        options={{ headerTitle: boards.length > 0 ? `Escena ${currentBoardIndex + 1}` : "" }}
      />
      <Stack.Screen
        component={ExerciseDetailScreen}
        name={AppRoutes.ExerciseDetail}
        options={{ headerTitle: "Detalle de Ejercicio" }}
      />
    </Stack.Navigator>
  );
};

export { PrivateStack };
