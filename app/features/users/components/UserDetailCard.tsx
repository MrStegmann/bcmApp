import React from "react";
import { Text, View } from "react-native";

import { User } from "../types";
import { userDetailCardStyles as styles } from "../css/styles";

type UserDetailCardProps = {
  user: User;
};

const UserDetailCard = ({ user }: UserDetailCardProps) => {
  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`Detalles del usuario ${user.name}`}>
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>
    </View>
  );
};

export { UserDetailCard };
