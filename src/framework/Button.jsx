import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({ onPress, title }) => {
  return (
    <TouchableOpacity
      className="w-full bg-danish-red py-2 flex items-center justify-center active:bg-danish-light-gray rounded-xl"
      onPress={onPress}
    >
      <Text className="text-danish-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
