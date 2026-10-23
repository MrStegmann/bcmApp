import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { View, TextInput, Text, TextInputProps } from "react-native";
import { applyDateMask } from "../utils/dateValidation";

interface InputProps extends Omit<TextInputProps, "onChange" | "value"> {
  value?: string | number;
  onChange?: (text: string) => void;
  type?: string;
  label?: string;
  wrongMsg?: string;
}

const Input: React.FC<InputProps> = ({
  value = "",
  onChange,
  type = "text",
  label,
  wrongMsg,
  ...props
}) => {
  const formatDate = (text: string) => {
    if (!onChange) return;
    if (type !== "date") return onChange(text);
    onChange(applyDateMask(text));
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
        keyboardType={props.keyboardType || (type === "date" ? "number-pad" : "default")}
        maxLength={props.maxLength || (type === "date" ? 10 : undefined)}
        {...props}
        value={value !== undefined && value !== null ? `${value}` : ""}
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
