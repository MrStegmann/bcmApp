import React from "react";
import { Text, TouchableOpacity } from "react-native";

const QuintetPlayers = React.memo(({ playerInf, inInToBench, onSelect }) => {
  return (
    <TouchableOpacity
      className={`border rounded-lg w-22 h-22 py-1 px-2 mb-1 ${inInToBench() ? "border-danish-gold" : "border-danish-red"}`}
      onPress={() => onSelect(playerInf.player_id)}
    >
      <Text className="text-danish-white text-center text-xs">
        {`${playerInf.number}`}
      </Text>
    </TouchableOpacity>
  );
});

export default QuintetPlayers;
