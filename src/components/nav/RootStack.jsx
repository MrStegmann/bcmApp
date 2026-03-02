import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../page/auth/Login";
import AuthLayout from "../../layouts/AuthLayout";
import Register from "../../page/auth/Register";
import Verifyer from "../../page/auth/Verifyer";
import Recover from "../../page/auth/Recover";
import PrivateLayout from "../../layouts/PrivateLayout";
import Staffs from "../../page/admin/Staffs";
import Home from "../../page/admin/Home";
import StaffForm from "../staff/StaffForm";
import Teams from "../../page/admin/Teams";
import TeamForm from "../team/TeamForm";
import Profile from "../../page/admin/Profile";
import TeamManager from "../../page/staff/TeamManager";
import StaffLayout from "../../layouts/StaffLayout";
import PathEnums from "../../Enums/PathEnums";
import TeamsList from "../../page/staff/TeamsList";
import Players from "../../page/staff/Players";
import PlayerForm from "../players/PlayerForm";
import PlayerDetails from "../players/PlayerDetails";
import Matches from "../../page/staff/Matches";
import MatchForm from "../matches/MatchForm";
import MathPlay from "../matches/MathPlay";
import MatchDetails from "../matches/MatchDetails";
import Trainings from "../../page/staff/Trainings";
import ExercicesForm from "../exercices/ExercicesForm";
import Exercices from "../../page/staff/Exercices";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName={PathEnums.LOGIN}>
      {/* Rutas públicas */}

      <Stack.Group screenLayout={AuthLayout}>
        <Stack.Screen name={PathEnums.LOGIN} component={Login} />
        <Stack.Screen name={PathEnums.REGISTER} component={Register} />
        <Stack.Screen name={PathEnums.VERIFY} component={Verifyer} />
        <Stack.Screen name={PathEnums.RECOVER} component={Recover} />
      </Stack.Group>

      {/* Rutas protegidas para Owners */}
      <Stack.Group screenLayout={PrivateLayout}>
        <Stack.Screen name={PathEnums.HOME} component={Home} />

        <Stack.Screen name={PathEnums.STAFFS} component={Staffs} />
        <Stack.Screen name={PathEnums.STAFFFORM} component={StaffForm} />

        <Stack.Screen name={PathEnums.TEAMS} component={Teams} />
        <Stack.Screen name={PathEnums.TEAMFORM} component={TeamForm} />

        <Stack.Screen name={PathEnums.PROFILE} component={Profile} />
      </Stack.Group>

      {/* Rutas privadas para entrenadores y owners */}
      <Stack.Group screenLayout={StaffLayout}>
        <Stack.Screen name={PathEnums.TEAMSLIST} component={TeamsList} />
        <Stack.Screen name={PathEnums.TEAMMANAGER} component={TeamManager} />
        <Stack.Screen name={PathEnums.PLAYERS} component={Players} />
        <Stack.Screen name={PathEnums.PLAYERFORM} component={PlayerForm} />
        <Stack.Screen
          name={PathEnums.PLAYERDETAILS}
          component={PlayerDetails}
        />

        <Stack.Screen name={PathEnums.TRAININGS} component={Trainings} />

        <Stack.Screen name={PathEnums.EXERCICES} component={Exercices} />
        <Stack.Screen
          name={PathEnums.EXERCICESFORM}
          component={ExercicesForm}
        />

        <Stack.Screen name={PathEnums.MATCHES} component={Matches} />
        <Stack.Screen name={PathEnums.MATCHFORM} component={MatchForm} />
        <Stack.Screen name={PathEnums.MATCHPLAY} component={MathPlay} />
        <Stack.Screen name={PathEnums.MATCHDETAILS} component={MatchDetails} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
