import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Item } from "../types";
import { templateDetailScreenStyles as styles } from "../css/styles";

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

type ItemDetailScreenProps = NativeStackScreenProps<
  MockAppStackParamList, // Sustituir por el tipo real de la navegación de la feature
  typeof MockAppRoutes.ItemDetail // Sustituir por la ruta real de la feature
>;

const ItemDetailScreen = ({ navigation, route }: ItemDetailScreenProps) => {
  const [item, _] = useState<Item>(route.params.item); // Sustituir por el parámetro real que se pasa para mostrar el detalle en la feature

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{item.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{item.role}</Text>
        </View>
      </View>

      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Volver</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export { ItemDetailScreen };
