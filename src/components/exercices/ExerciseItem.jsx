import { View, TouchableOpacity, Text } from "react-native";

const ExerciseItem = ({ exercise, onSelect, onDelete, onEdit }) => {
  const others = exercise.flags
    .split(",")
    .filter((f) => f.startsWith("physical:") || f.startsWith("warmUp:"));
  const tacticals = exercise.flags
    .split(",")
    .filter((f) => f.startsWith("tactical:"));
  const colectives = exercise.flags
    .split(",")
    .filter((f) => f.startsWith("colective:"));
  const techniques = exercise.flags
    .split(",")
    .filter((f) => f.startsWith("technique:"));
  return (
    <View className="w-full p-4 border border-gray-300 rounded-lg mb-2 flex flex-col justify-between items-center">
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-1/3 flex flex-col justify-center items-center">
          <Text className="text-lg font-semibold">{exercise.title}</Text>
          <Text>{exercise.description}</Text>
        </View>
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
            onPress={onDelete}
          >
            <Text className="text-white">Del</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex flex-row gap-1 mt-2">
        {others.length > 0 ? (
          <View className="flex-col">
            <Text className="font-bold text-sm">Otros</Text>
            {others.map((f) => (
              <Text key={f} className="text-xs bg-gray-200 px-2 py-1 rounded">
                {f.split(":")[1]}
              </Text>
            ))}
          </View>
        ) : null}

        {tacticals.length > 0 ? (
          <View className="flex-col">
            <Text className="font-bold text-sm">Táctica</Text>
            {tacticals.map((f) => (
              <Text key={f} className="text-xs bg-green-200 px-2 py-1 rounded">
                {f.split(":")[1]}
              </Text>
            ))}
          </View>
        ) : null}

        {colectives.length > 0 ? (
          <View className="flex-col">
            <Text className="font-bold text-sm">Colectivo</Text>
            {colectives.map((f) => (
              <Text key={f} className="text-xs bg-yellow-200 px-2 py-1 rounded">
                {f.split(":")[1]}
              </Text>
            ))}
          </View>
        ) : null}

        {techniques.length > 0 ? (
          <View className="flex-col">
            <Text className="font-bold text-sm">Técnica</Text>
            {techniques.map((f) => (
              <Text key={f} className="text-xs bg-purple-200 px-2 py-1 rounded">
                {f.split(":")[1]}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ExerciseItem;
