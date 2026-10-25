import React from "react";
import { Text, TouchableOpacity, GestureResponderEvent } from "react-native";

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title: string;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "destructive";
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled,
  className = "",
  variant = "primary",
}) => {
  const getVariantStyles = () => {
    if (disabled) {
      return "bg-slate-border/50 border-slate-border opacity-50";
    }
    switch (variant) {
      case "secondary":
      case "outline":
        return "border-2 border-tactical-blue bg-transparent active:bg-tactical-blue/10";
      case "destructive":
        return "bg-error-container border-error-container active:bg-[#690005]";
      case "primary":
      default:
        return "bg-court-orange border-court-orange active:bg-court-orange-dark shadow-md";
    }
  };

  const getTextColor = () => {
    if (disabled) return "text-slate-400";
    switch (variant) {
      case "secondary":
      case "outline":
        return "text-tactical-blue-light";
      case "destructive":
        return "text-[#FFDAD6]";
      case "primary":
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      className={`min-h-[48px] px-6 py-3 rounded-lg border flex items-center justify-center ${getVariantStyles()} ${className}`}
      onPress={onPress}
    >
      <Text className={`${getTextColor()} font-bold uppercase tracking-wider text-sm`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
