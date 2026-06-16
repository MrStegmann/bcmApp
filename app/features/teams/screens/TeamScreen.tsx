import React from "react";
import { View, Text } from "react-native";
import { useTeamStore } from "../store/teamStore";
import { teamScreenStyles as styles } from "../css/styles";

const TeamScreen = () => {
  const team = useTeamStore((state) => state.team);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{team?.name}</Text>
      {/* Add more team details here as needed */}
    </View>
  );
};

export { TeamScreen };
