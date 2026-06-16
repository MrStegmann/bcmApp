import React from "react";
import { Text, TouchableOpacity } from "react-native-web";

const BenchPlayer = React.memo(({ playerInf, isInToQuintet, onSelect }) => {
  return (
    <TouchableOpacity
      className={`border rounded-lg w-22 h-22 py-1 px-2 mr-1 ${isInToQuintet() ? "border-danish-gold" : "border-danish-red"}`}
      onPress={() => onSelect(playerInf.player_id)}
    >
      <Text className="text-danish-white text-center text-xs">
        {`${playerInf.number}`}
      </Text>
    </TouchableOpacity>
  );
});

export default BenchPlayer;
