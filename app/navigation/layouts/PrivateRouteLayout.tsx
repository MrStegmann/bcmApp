import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { UserNavigation } from "../../shared";

type PrivateRouteLayoutProps = {
  children: ReactNode;
};

export const PrivateRouteLayout = ({ children }: PrivateRouteLayoutProps) => {
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={{ flex: 1 }}>{children}</View>
      <UserNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
});
