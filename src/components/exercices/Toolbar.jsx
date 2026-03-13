import TokenEnums from "../../Enums/TokenEnums";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SvgAttackerIcon from "./SvgAttackerIcon";
import SvgPathIcons from "./assests/SvgPathIcons";
import { usePlaybookStore } from "../../store/PlaybookStore";
import HalfCourt from "./assests/HalfCourt";
import FullCourt from "./assests/FullCourt";
import { useEffect, useState } from "react";
import Options from "./Options";
import OffesinvePlayer from "./assests/OffesinvePlayer";
import DefensivePlayer from "./assests/DefensivePlayer";
import Ball from "./assests/Ball";
import HandByHand from "./assests/HandByHand";
import SaveButton from "../../framework/SaveButton";
import Cone from "./assests/Cone";

const tokens = Object.keys(TokenEnums).map((key) => ({
  key,
  value: TokenEnums[key],
}));

const IconToolbar = ({ value }) => {
  switch (value) {
    case TokenEnums.OFFENSIVE:
      return <OffesinvePlayer label="O" />;
    case TokenEnums.DEFENSIVE:
      return <DefensivePlayer label="D" />;
    case TokenEnums.BALL:
      return <Ball />;
    case TokenEnums.CONE:
      return <Cone />;
    case TokenEnums.MOVEMENT_LINE:
      return <SvgPathIcons path="run" />;
    case TokenEnums.PASS_LINE:
      return <SvgPathIcons path="pass" />;
    case TokenEnums.DRIBBLING_LINE:
      return <SvgPathIcons path="dribling" />;
    case TokenEnums.BLOCK_LINE:
      return <SvgPathIcons path="block" />;
    case TokenEnums.HAND_BY_HAND:
      return <HandByHand />;
    case TokenEnums.SELECT_OBJECT:
      return (
        <MaterialCommunityIcons
          name="cursor-default-click"
          size={24}
          color="black"
        />
      );
    default:
      return <MaterialCommunityIcons name="tools" size={24} color="black" />;
  }
};

const Toolbar = ({
  onDelete,
  setShowOptions,
  showOptions,
  onAddStage,
  onRemoveStage,
  onSave,
}) => {
  const setActiveTool = usePlaybookStore((state) => state.setActiveTool);
  const activeTool = usePlaybookStore((state) => state.activeTool);
  const loading = usePlaybookStore((state) => state.loading);
  const setSelectedObject = usePlaybookStore(
    (state) => state.setSelectedObject,
  );
  const setHalfCourt = usePlaybookStore((state) => state.setHalfCourt);
  const halfCourt = usePlaybookStore((state) => state.halfCourt);

  return (
    <View className="flex flex-col gap-y-1 items-center border-l bg-gray-300 p-2">
      {tokens.map((token) => (
        <TouchableOpacity
          key={token.key}
          className={`w-10 h-10 flex justify-center items-center ${activeTool === token.value ? "border border-blue-500 rounded" : ""}`}
          onPress={() => {
            setActiveTool(activeTool === token.value ? "" : token.value);
            setSelectedObject(null);
          }}
        >
          <IconToolbar value={token.value} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        className={`w-10 h-10 flex justify-center items-center`}
        onPress={() => {
          setHalfCourt(!halfCourt);
        }}
      >
        {!halfCourt ? <HalfCourt /> : <FullCourt />}
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-10 h-10 flex justify-center items-center`}
        onPress={onDelete}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="red"
        />
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-10 h-10 flex justify-center items-center`}
        onPress={() => setShowOptions((prev) => !prev)}
      >
        {showOptions ? (
          <Entypo name="arrow-right" size={24} color="black" />
        ) : (
          <Entypo name="dots-three-vertical" size={24} color="black" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-10 h-10 flex justify-center items-center`}
        onPress={onAddStage}
      >
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-10 h-10 flex justify-center items-center`}
        onPress={onRemoveStage}
      >
        <MaterialIcons name="remove" size={24} color="black" />
      </TouchableOpacity>

      <SaveButton onPress={onSave} isLoading={loading} />
    </View>
  );
};

export default Toolbar;
