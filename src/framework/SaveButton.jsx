import React, { useRef, useEffect } from "react";
import { Animated, Easing, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const SaveButton = ({ onPress, isLoading }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <TouchableOpacity
      className="rounded-full flex flex-row justify-center items-center"
      onPress={onPress}
    >
      {isLoading ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <MaterialCommunityIcons name="loading" size={24} color="black" />
        </Animated.View>
      ) : (
        <Entypo name="save" size={18} color="black" />
      )}
    </TouchableOpacity>
  );
};

export default SaveButton;
