import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TeamListPage from '../screens/TeamListPage';
import TeamForm from '../screens/TeamForm';
import TeamManagerPage from '../screens/TeamManagerPage';

const RootStack = createNativeStackNavigator({
  screens: {
    TeamListPage: { screen: TeamListPage, options: { headerShown: false } },
    TeamForm: { screen: TeamForm, options: { headerShown: false } },
    TeamManagerPage: { screen: TeamManagerPage, options: { headerShown: false } },
  },
});

export const Navigation = createStaticNavigation(RootStack as any);
