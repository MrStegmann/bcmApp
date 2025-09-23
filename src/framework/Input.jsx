import Feather from "@expo/vector-icons/Feather";
import { View, TextInput, Text } from "react-native";

const Input = ({ value, onChange, label, wrongMsg, ...props }) => {
  return (
    <View className="w-full flex flex-col justify-center items-center">
      {label && (
        <Text className="text-left font-bold w-full px-4 text-lg text-danish-dark-gray">
          {label}
        </Text>
      )}
      <TextInput
        className="border-4 rounded-xl border-danish-red px-3 w-full"
        {...props}
        value={`${value}`}
        onChangeText={onChange}
      />
      {wrongMsg && (
        <View className="flex flex-row w-full items-center justify-start mb-2">
          <Feather name="alert-circle" size={24} color="red" />
          <Text className="text-red-600 font-semibold py-2">{wrongMsg}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
