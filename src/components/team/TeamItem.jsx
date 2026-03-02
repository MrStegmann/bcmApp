import { Text, TouchableOpacity, View } from "react-native";

const TeamItem = ({ team, onSelect, onDelete, onEdit }) => (
  <View className="w-full p-4 border border-gray-300 rounded-lg mb-2 flex flex-row justify-between items-center">
    <Text className="text-lg font-semibold w-1/3">{team.name}</Text>
    <View className="flex flex-row gap-2">
      <TouchableOpacity
        onPress={onSelect}
        className="bg-blue-500 px-3 py-1 rounded"
      >
        <Text className="text-white">Select</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onEdit}
        className="bg-blue-500 px-3 py-1 rounded"
      >
        <Text className="text-white">Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-500 px-3 py-1 rounded"
        onPress={() => onDelete(team)}
      >
        <Text className="text-white">Del</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default TeamItem;
