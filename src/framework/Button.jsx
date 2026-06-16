import React from "react";
import { Text, TouchableOpacity } from "react-native-web";

const Button = ({ onPress, title }) => {
  return (
    <TouchableOpacity
      className="border-2 py-2 bg-danish-red border-danish-dark-gray shadow shadow-black rounded-xl flex items-center justify-center active:bg-danish-light-gray"
      onPress={onPress}
    >
      <Text className="text-danish-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
