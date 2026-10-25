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
        <Text className="text-left font-bold w-full px-1 mb-1.5 text-sm text-on-surface">
          {label}
        </Text>
      )}
      <TextInput
        className="border border-slate-border focus:border-tactical-blue rounded-xl px-4 py-3 w-full bg-slate-dark text-on-surface placeholder:text-outline text-sm min-h-[48px]"
        placeholderTextColor="#A78B7D"
        keyboardType={props.keyboardType || (type === "date" ? "number-pad" : "default")}
        maxLength={props.maxLength || (type === "date" ? 10 : undefined)}
        {...props}
        value={value !== undefined && value !== null ? `${value}` : ""}
        onChangeText={formatDate}
      />
      <View className="flex flex-row w-full items-center justify-start h-8 pt-1">
        {wrongMsg ? (
          <>
            <Feather name="alert-circle" size={16} color="#EF4444" />
            <Text className="text-court-red font-semibold py-1 ml-1.5 text-xs">
              {wrongMsg}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default Input;
