import { Text, View, TextInput } from "react-native";
import React from "react";

const Marker = React.memo(
  ({ quarter, result, setResult, teamFalt, setTeamFalt }) => {
    const changeResult = (value, team) => {
      const newResult = { ...result };
      const intValue = parseInt(value, 10);
      newResult[quarter][team] = isNaN(intValue) ? 0 : intValue;
      setResult(newResult);
    };
    const changeFalt = (value, team) => {
      const newFalt = { ...teamFalt };
      const intValue = parseInt(value, 10);
      newFalt[quarter][team] = isNaN(intValue) ? 0 : intValue;
      setTeamFalt(newFalt);
    };
    return (
      <View className="flex flex-col w-full items-center mb-1 border-b border-danish-light-gray p-2">
        <View className="w-full flex flex-row justify-center items-center">
          <View className="w-1/3 flex flex-col justify-center items-center">
            <Text className="text-danish-white text-xs text-center mb-1">
              Pts
            </Text>
            <TextInput
              className="border rounded-xl border-danish-red shadow-inner shadow-danish-gold px-3 w-1/3 text-center bg-danish-dark-gray text-danish-white placeholder:text-danish-white text-xs"
              value={`${result[quarter].team}`}
              onChangeText={(value) => changeResult(value, "team")}
            />
            <Text className="text-danish-white text-xs text-center mb-1">
              Falts
            </Text>
            <TextInput
              className="border rounded-xl border-danish-red shadow-inner shadow-danish-gold px-3 w-1/3 text-center bg-danish-dark-gray text-danish-white placeholder:text-danish-white text-xs"
              value={`${teamFalt[quarter].team}`}
              onChangeText={(value) => changeFalt(value, "team")}
            />
          </View>
          <Text className="text-danish-white capitalize text-xs w-1/3 text-center">
            {quarter}
          </Text>
          <View className="w-1/3 flex flex-col justify-center items-center">
            <Text className="text-danish-white text-xs text-center mb-1">
              Pts
            </Text>
            <TextInput
              className="border rounded-xl border-danish-red shadow-inner shadow-danish-gold px-3 w-1/3 text-center bg-danish-dark-gray text-danish-white placeholder:text-danish-white text-xs"
              value={`${result[quarter].opponent}`}
              onChangeText={(value) => changeResult(value, "opponent")}
            />
            <Text className="text-danish-white text-xs text-center mb-1">
              Falts
            </Text>
            <TextInput
              className="border rounded-xl border-danish-red shadow-inner shadow-danish-gold px-3 w-1/3 text-center bg-danish-dark-gray text-danish-white placeholder:text-danish-white text-xs"
              value={`${teamFalt[quarter].opponent}`}
              onChangeText={(value) => changeFalt(value, "opponent")}
            />
          </View>
        </View>
      </View>
    );
  }
);

export default Marker;
