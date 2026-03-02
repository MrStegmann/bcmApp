import { Text, TouchableOpacity, View } from "react-native";

const StaffItem = ({ staff, onDelete, onEdit }) => (
  <View className="w-full p-4 border border-gray-300 rounded-lg mb-2 flex flex-row justify-between items-center">
    <Text className="text-lg font-semibold">{staff.name}</Text>
    <Text className="text-gray-600">{staff.email}</Text>
    <View className="flex flex-row gap-2">
      <TouchableOpacity
        onPress={onEdit}
        className="bg-blue-500 px-3 py-1 rounded"
      >
        <Text className="text-white">Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-500 px-3 py-1 rounded"
        onPress={() => onDelete(staff)}
      >
        <Text className="text-white">Del</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default StaffItem;
