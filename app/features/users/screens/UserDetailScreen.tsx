import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { useAppAlert } from "../../../shared";
import { useAuthStore } from "../../login";
import { promoteUserToRoot } from "../api/userApi";
import { getUsersErrorMessage } from "../errors";
import { UserDetailCard } from "../components/UserDetailCard";
import { User } from "../types";
import { userDetailScreenStyles as styles } from "../css/styles";

type UserDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.UserDetail
>;

const UserDetailScreen = ({ navigation, route }: UserDetailScreenProps) => {
  const { showConfirmation, showError } = useAppAlert();
  const authRole = useAuthStore((state) => state.auth?.role);
  const [user, setUser] = useState<User>(route.params.user);
  const [isPromoting, setIsPromoting] = useState(false);

  const canPromoteToRoot = authRole === "root" && user.role !== "root";

  const handlePromoteToRoot = () => {
    showConfirmation(
      "Promover a root",
      `Vas a promover a ${user.name} como root. Esta accion es sensible. ¿Deseas continuar?`,
      async () => {
        try {
          setIsPromoting(true);
          const updatedUser = await promoteUserToRoot(user.id);
          setUser(updatedUser);
        } catch (error) {
          showError(
            "Error",
            getUsersErrorMessage(
              error,
              "No se pudo promover el usuario a root.",
            ),
          );
        } finally {
          setIsPromoting(false);
        }
      },
    );
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header">
          Detalles de Usuario
        </Text>

        <UserDetailCard user={user} />

        {canPromoteToRoot ? (
          <Pressable
            disabled={isPromoting}
            onPress={handlePromoteToRoot}
            style={({ pressed }) => [
              styles.promoteButton,
              isPromoting ? styles.promoteButtonDisabled : null,
              pressed && !isPromoting ? { opacity: 0.8 } : null
            ]}
            accessibilityRole="button"
            accessibilityLabel="Promover usuario a administrador raíz"
            accessibilityHint="Asigna permisos máximos a este usuario"
            accessibilityState={{ disabled: isPromoting }}
          >
            <Text style={styles.promoteButtonText}>
              {isPromoting ? "Promoviendo..." : "Promover a Root"}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed ? { opacity: 0.8 } : null
          ]}
          accessibilityRole="button"
          accessibilityLabel="Volver a la lista"
          accessibilityHint="Regresa a la pantalla anterior"
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export { UserDetailScreen };
