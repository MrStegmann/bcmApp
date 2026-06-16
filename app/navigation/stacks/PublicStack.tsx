import React from "react";
import { LoginScreen } from "../../features/login";
import { PublicRouteLayout } from "../layouts/PublicRouteLayout";
import { AppRoutes, AppStackParamList } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<AppStackParamList>();

const PublicStack = () => {
  return (
    <Stack.Navigator id={undefined} screenLayout={PublicRouteLayout}>
      <Stack.Screen component={LoginScreen} name={AppRoutes.Login} />
    </Stack.Navigator>
  );
};

export { PublicStack };
