import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const SelectInput = ({ cb, options, defaultOption }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultOption ? defaultOption : "",
  );

  useEffect(() => {
    if (cb) {
      cb(selectedOption.value);
    }
  }, [selectedOption]);

  return (
    <View className="flex flex-col mt-5 w-full">
      <View
        className={`flex flex-row border-x border-y ${showOptions ? "rounded-t-lg" : "rounded-lg"} border-gray-300 justify-between items-center`}
      >
        <Text className="p-3">{selectedOption.label}</Text>
        <TouchableOpacity
          onPress={() => setShowOptions(!showOptions)}
          className="p-2 border-l border-gray-300"
        >
          {showOptions ? (
            <MaterialIcons name="arrow-drop-up" size={24} color="black" />
          ) : (
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <View
        className={`flex flex-col ${showOptions ? "" : "hidden"} border-x border-b border-gray-300 rounded-b-lg`}
      >
        {options
          ? options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={`p-2 ${selectedOption.value === option.value ? "bg-gray-200" : ""}`}
                onPress={() => {
                  setSelectedOption(option);
                  setShowOptions(false);
                }}
              >
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))
          : null}
      </View>
    </View>
  );
};

export default SelectInput;
