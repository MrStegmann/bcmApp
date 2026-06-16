import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppRoutes, AppStackParamList } from "../../../navigation/types";
import { useAppAlert } from "../../../shared";
import { User } from "../types";
import { deleteUser, getUsers } from "../api/userApi";
import { getUsersErrorMessage } from "../errors";
import { useAuthStore } from "../../login";
import { usersListScreenStyles as styles } from "../css/styles";

type UsersListScreenProps = NativeStackScreenProps<
  AppStackParamList,
  typeof AppRoutes.Users
>;

const UsersListScreen = ({ navigation }: UsersListScreenProps) => {
  const { showAlert } = useAppAlert();
  const auth = useAuthStore((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const usersResponse = await getUsers();
      setUsers(
        usersResponse.filter((listedUser) => listedUser.email !== auth?.email),
      );
      setErrorMessage(null);
    } catch (error) {
      console.warn("No se pudo obtener la lista de usuarios", error);
      setErrorMessage(
        getUsersErrorMessage(error, "No se pudo cargar la lista de usuarios."),
      );
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers]),
  );

  const handleDeleteUser = useCallback(
    (user: User) => {
      showAlert({
        title: "Eliminar usuario",
        message: `Esta accion eliminara a ${user.name}. ¿Deseas continuar?`,
        buttons: [
          {
            style: "cancel",
            text: "Cancelar",
          },
          {
            style: "destructive",
            text: "Eliminar",
            onPress: async () => {
              try {
                setDeletingUserId(user.id);
                await deleteUser(user.id);
                await loadUsers(true);
              } catch (error) {
                console.warn("No se pudo eliminar el usuario", error);
                showAlert({
                  title: "Error",
                  message: getUsersErrorMessage(
                    error,
                    "No se pudo eliminar el usuario. Intentalo de nuevo.",
                  ),
                });
              } finally {
                setDeletingUserId(null);
              }
            },
          },
        ],
      });
    },
    [loadUsers, showAlert],
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title} accessibilityRole="header">
            Usuarios
          </Text>
          <Pressable
            onPress={() => navigation.navigate("UserForm")}
            style={({ pressed }) => [
              styles.createButton,
              pressed ? { opacity: 0.8 } : null
            ]}
            accessibilityRole="button"
            accessibilityLabel="Crear nuevo usuario"
            accessibilityHint="Navega a la pantalla de creación de un nuevo usuario"
          >
            <Text style={styles.createButtonText}>Nuevo</Text>
          </Pressable>
        </View>

        <FlatList
          contentContainerStyle={styles.listContainer}
          data={users}
          keyExtractor={(item) => item.id}
          onRefresh={() => loadUsers(true)}
          refreshing={isRefreshing}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.emptyStateText}>Cargando usuarios...</Text>
              </View>
            ) : (
              <View style={styles.emptyState} accessibilityRole="alert">
                <Text style={styles.emptyStateText}>
                  {errorMessage ?? "No hay usuarios para mostrar."}
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>
              </View>

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() =>
                    navigation.navigate("UserForm", {
                      user: item,
                    })
                  }
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed ? { opacity: 0.8 } : null
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar usuario ${item.name}`}
                  accessibilityHint="Navega a la pantalla para editar este usuario"
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    navigation.navigate("UserDetail", {
                      user: item,
                    })
                  }
                  style={({ pressed }) => [
                    styles.viewButton,
                    pressed ? { opacity: 0.8 } : null
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalles del usuario ${item.name}`}
                  accessibilityHint="Navega a la pantalla con los detalles completos de este usuario"
                >
                  <Text style={styles.viewButtonText}>Ver</Text>
                </Pressable>

                <Pressable
                  disabled={deletingUserId === item.id}
                  onPress={() => handleDeleteUser(item)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    deletingUserId === item.id ? styles.disabledDeleteButton : null,
                    pressed && deletingUserId !== item.id ? { opacity: 0.8 } : null
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar usuario ${item.name}`}
                  accessibilityHint="Pide confirmación para eliminar a este usuario"
                  accessibilityState={{ disabled: deletingUserId === item.id }}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingUserId === item.id ? "Eliminando..." : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export { UsersListScreen };
