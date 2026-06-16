import React, { ReactNode, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { autoLoginWithJwtToken } from "../../features/login/api/authApi";
import { useAuthStore } from "../../features/login/store/authStore";

type PublicRouteLayoutProps = {
  children: ReactNode;
};

export const PublicRouteLayout = ({ children }: PublicRouteLayoutProps) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authDataString = await AsyncStorage.getItem("auth");
        if (authDataString) {
          const authData = JSON.parse(authDataString);
          const response = await autoLoginWithJwtToken(authData.token);
          if (response) {
            useAuthStore.getState().saveAuth({
              name: response.name,
              email: response.email,
              token: authData.token,
              role: response.role,
            });
          } else {
            await AsyncStorage.removeItem("auth");
          }
        }
      } catch (error) {
        console.error("Error during auto-login:", error);
      }
    };
    checkAuth();
  }, []);
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
});
