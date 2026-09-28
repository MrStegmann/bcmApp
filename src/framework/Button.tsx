import React from "react";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title }) => {
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
