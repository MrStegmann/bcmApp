import { useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AppRoutes, AppStackParamList } from "../../navigation/types";
import { useTeamStore } from "../../features/teams";
import { useNavigationStore } from "./useNavigationStore";

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const team = useTeamStore((state) => state.team);
  const setTeam = useTeamStore((state) => state.setTeam);
  const setPendingRoute = useNavigationStore((state) => state.setPendingRoute);

  const navigate = (route: keyof AppStackParamList, params?: any) => {
    // Definimos qué rutas pertenecen a qué stack para gestionar el cambio
    const privateRoutes: Array<keyof AppStackParamList> = [
      AppRoutes.Home,
      AppRoutes.Users,
      AppRoutes.UserForm,
      AppRoutes.UserDetail,
      AppRoutes.Teams,
      AppRoutes.TeamForm,
      AppRoutes.Exercises,
      AppRoutes.ExerciseForm,
      AppRoutes.ExerciseDetail,
    ];

    const teamRoutes: Array<keyof AppStackParamList> = [
      AppRoutes.TeamDetail,
      AppRoutes.Players,
      AppRoutes.PlayerForm,
      AppRoutes.PlayerDetail,
      AppRoutes.Games,
      AppRoutes.GameForm,
      AppRoutes.GameDetail,
      AppRoutes.GameRoster,
    ];

    // Si queremos ir a una ruta privada pero estamos dentro del TeamStack
    if (privateRoutes.includes(route) && team) {
      setPendingRoute(route, params);
      setTeam(null); // Esto desmonta el TeamStack y monta el PrivateStack
      return;
    }

    // Si la ruta requiere un equipo, pero no tenemos uno
    if (teamRoutes.includes(route) && !team) {
      console.warn("Intentando navegar a una ruta de equipo sin equipo seleccionado");
      return;
    }

    // Navegación estándar
    (navigation as any).navigate(route, params);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Si no podemos retroceder pero estamos en el TeamStack, volvemos a Teams
      if (team) {
        setTeam(null);
      }
    }
  };

  return { navigate, goBack, rawNavigation: navigation };
};

export const useProcessPendingNavigation = () => {
  const { navigate } = useAppNavigation();
  const pendingRoute = useNavigationStore((state) => state.pendingRoute);
  const pendingParams = useNavigationStore((state) => state.pendingParams);
  const clearPendingRoute = useNavigationStore((state) => state.clearPendingRoute);

  useEffect(() => {
    if (pendingRoute) {
      // Usamos setTimeout breve para asegurar que el stack se haya montado en React Navigation
      const timeout = setTimeout(() => {
        navigate(pendingRoute, pendingParams);
        clearPendingRoute();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [pendingRoute, pendingParams, navigate, clearPendingRoute]);
};
