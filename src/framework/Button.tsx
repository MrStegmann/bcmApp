import React from "react";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, disabled, className = "" }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={`border-2 py-2 shadow shadow-black rounded-xl flex items-center justify-center ${
        disabled
          ? "bg-gray-600 border-gray-500 opacity-50"
          : "bg-danish-red border-danish-dark-gray active:bg-danish-light-gray"
      } ${className}`}
      onPress={onPress}
    >
      <Text className="text-danish-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
