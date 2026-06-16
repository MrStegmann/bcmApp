import Feather from "@expo/vector-icons/Feather";
import { View, TextInput, Text } from "react-native-web";

const Input = ({
  value,
  onChange,
  type = "text",
  label,
  wrongMsg,
  ...props
}) => {
  const formatDate = (text) => {
    if (type !== "date") return onChange(text);
    // Elimina todo lo que no sea número
    let cleaned = text.replace(/\D/g, "");

    // Aplica formato DD/MM/YYYY
    if (cleaned.length >= 5) {
      cleaned = cleaned.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, "$1/$2/$3");
    } else if (cleaned.length >= 3) {
      cleaned = cleaned.replace(/^(\d{2})(\d{0,2}).*/, "$1/$2");
    }

    onChange(cleaned);
  };
  return (
    <View className="w-full flex flex-col justify-center items-center">
      {label && (
        <Text className="text-left font-bold w-full px-4 text-lg text-danish-white">
          {label}
        </Text>
      )}
      <TextInput
        className="border-2 rounded-xl border-danish-red shadow-inner shadow-danish-gold px-3 w-full bg-danish-dark-gray text-danish-white placeholder:text-danish-white text-xs"
        {...props}
        value={`${value}`}
        onChangeText={formatDate}
      />
      <View className="flex flex-row w-full items-center justify-start h-9 pt-1">
        {wrongMsg ? (
          <>
            <Feather name="alert-circle" size={16} color="red" />
            <Text className="text-red-600 font-semibold py-2 ml-1 text-sm">
              {wrongMsg}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default Input;
