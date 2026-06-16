import { Text, TouchableOpacity, View } from "react-native-web";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const MatchItem = ({
  match,
  onSelect,
  onPlay,
  onConfigure,
  onEdit,
  onDelete,
}) => {
  return (
    <View
      className={`w-full p-4 border ${match.played ? (match.totalTeamPoints < match.totalRivalPoints ? "border-red-400" : "border-danish-gold") : "border-gray-300"} rounded-lg mb-2 flex flex-row justify-between items-center`}
    >
      <TouchableOpacity
        onPress={onSelect}
        className="w-2/4 flex flex-row justify-start items-center"
      >
        <View className="w-2/5 flex flex-col justify-center items-center mr-2">
          <Text className="text-xs">Jda. {match.round}</Text>
          <Text className="text-xs">{match.date}</Text>
          <Text className="text-xs">
            {match.played ? "Terminado" : "No comenzado"}
          </Text>
        </View>
        <View className="w-1/2 flex flex-row justify-between items-center gap-x-4">
          <Text className="font-semibold text-center text-wrap">
            {match.rival}
          </Text>
          {match.played ? (
            <Text className="font-semibold text-center text-wrap">{`${match.totalTeamPoints}-${match.totalRivalPoints}`}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <View className="flex flex-row gap-2">
        {!match.played && (
          <TouchableOpacity
            onPress={onPlay}
            className="border border-blue-500 px-3 py-1 rounded"
          >
            <MaterialCommunityIcons
              name="whistle-outline"
              size={18}
              color="blue"
            />
          </TouchableOpacity>
        )}
        {!match.played && (
          <TouchableOpacity
            onPress={onConfigure}
            className="border border-blue-500 px-3 py-1 rounded"
          >
            <MaterialIcons name="settings" size={18} color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onEdit}
          className="border border-blue-500 px-3 py-1 rounded"
        >
          <Feather name="edit" size={18} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-red-500 px-3 py-1 rounded"
          onPress={() => onDelete(match)}
        >
          <Feather name="trash" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MatchItem;
