import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CheckBoxInput = ({ onPress, value, text }) => {
  return (
    <View className="flex flex-row items-center">
      <TouchableOpacity onPress={onPress}>
        <View>
          <MaterialIcons
            name={value ? "check-box" : "check-box-outline-blank"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <Text>{text}</Text>
    </View>
  );
};

export default CheckBoxInput;
