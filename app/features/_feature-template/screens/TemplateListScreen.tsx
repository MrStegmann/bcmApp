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
import { useAppAlert } from "../../../shared/hooks/useAppAlert";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Item } from "../types";
import { deleteItem, getItems } from "../api";
import { getItemsErrorMessage } from "../errors";
import { templateListScreenStyles as styles } from "../css/styles";

const MockAppRoutes = {
  // Eliminar
  Items: "Items",
  ItemForm: "ItemForm",
  ItemDetail: "ItemDetail",
} as const;

type MockAppStackParamList = {
  // Eliminar
  [MockAppRoutes.Items]: undefined;
  [MockAppRoutes.ItemForm]: { item: Item | undefined };
  [MockAppRoutes.ItemDetail]: { item: Item };
};

type ItemsListScreenProps = NativeStackScreenProps<
  MockAppStackParamList, // Sustituir por el tipo real de la navegación de la feature
  typeof MockAppRoutes.Items // Sustituir por la ruta real de la feature
>;

const TemplateListScreen = ({ navigation }: ItemsListScreenProps) => {
  const { showAlert } = useAppAlert();
  const [items, setItems] = useState<Item[]>([]); // Sustituir por estado real de la feature
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null); // Sustituir por estado real de la feature

  const loadItems = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Simulate loading data
      const data = await getItems(); // Sustituir por llamada real a la API de la feature
      setItems(data);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems]),
  );

  const handleDeleteItem = useCallback(
    (item: Item) => {
      showAlert({
        title: "Eliminar item",
        message: `Esta accion eliminara a ${item.name}. ¿Deseas continuar?`,
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
                setDeletingItemId(item.id);
                await deleteItem(item.id);
                await loadItems(true);
              } catch (error) {
                showAlert({
                  title: "Error al eliminar",
                  message: getItemsErrorMessage(
                    error,
                    "No se pudo eliminar el item. Intentalo de nuevo.",
                  ),
                });
              } finally {
                setDeletingItemId(null);
              }
            },
          },
        ],
      });
    },
    [loadItems],
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => {}} style={styles.createButton}>
            <Text style={styles.createButtonText}>Nuevo</Text>
          </Pressable>
        </View>

        <FlatList
          contentContainerStyle={styles.listContainer}
          data={items}
          keyExtractor={(item) => item.id}
          onRefresh={() => loadItems(true)}
          refreshing={isRefreshing}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color="#0b5fff" />
                <Text style={styles.emptyStateText}>Cargando...</Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No hay datos para mostrar.
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
                    navigation.navigate(MockAppRoutes.ItemForm, {
                      item: item,
                    })
                  }
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    navigation.navigate(MockAppRoutes.ItemDetail, {
                      item: item,
                    });
                  }}
                  style={styles.viewButton}
                >
                  <Text style={styles.viewButtonText}>Ver</Text>
                </Pressable>

                <Pressable
                  disabled={deletingItemId === item.id}
                  onPress={() => handleDeleteItem(item)}
                  style={[
                    styles.deleteButton,
                    deletingItemId === item.id
                      ? styles.disabledDeleteButton
                      : null,
                  ]}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingItemId === item.id ? "Eliminando..." : "Eliminar"}
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

export default TemplateListScreen;
