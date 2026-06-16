import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Game } from "../types";
import { gameDetailScreenStyles as styles } from "../css/styles";
import { AppStackParamList, AppRoutes } from "../../../navigation";

type GameDetailScreenProps = NativeStackScreenProps<
  AppStackParamList, // Sustituir por el tipo real de la navegación de la feature
  typeof AppRoutes.GameDetail // Sustituir por la ruta real de la feature
>;

const GameDetailScreen = ({ navigation, route }: GameDetailScreenProps) => {
  const [game, _] = useState<Game>(route.params.game); // Sustituir por el parámetro real que se pasa para mostrar el detalle en la feature

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>ID</Text>
          <Text style={styles.value}>{game.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rival</Text>
          <Text style={styles.value}>{game.rival}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Jornada</Text>
          <Text style={styles.value}>{game.round}</Text>
        </View>
      </View>

      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Volver</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export { GameDetailScreen };
