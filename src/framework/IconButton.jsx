import React from "react";
import { Text } from "react-native";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import IconsEnums from "../Enums/IconsEnums";

const IconButton = ({ value, alt }) => {
  const size = 20;
  const color = "black";
  if (!value)
    return <Text className="text-xs text-center text-danish-white">{alt}</Text>;
  if ([IconsEnums.HOME, IconsEnums.USERS, IconsEnums.TRAININGS].includes(value))
    return <Entypo name={value} size={size} color={color} />;

  if (
    [IconsEnums.SHIELD, IconsEnums.SETTINGS, IconsEnums.DOOR_FRONT].includes(
      value,
    )
  )
    return <MaterialIcons name={value} size={size} color={color} />;

  if ([IconsEnums.MATCHES, IconsEnums.EXERCICES].includes(value))
    return <MaterialCommunityIcons name={value} size={size} color={color} />;
};

export default IconButton;
