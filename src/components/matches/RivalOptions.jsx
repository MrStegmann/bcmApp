import { View, Text, TouchableOpacity } from "react-native-web";
import { useCronoStore, useMarketStore } from "../../store/MatchStore";
import React from "react";

const RivalOptions = React.memo(() => {
  const addRivalFoult = useMarketStore((state) => state.addRivalFoult);
  const substractRivalFoult = useMarketStore(
    (state) => state.substractRivalFoult,
  );
  const addOneRivalPoints = useMarketStore((state) => state.addOneRivalPoints);
  const addTwoRivalPoints = useMarketStore((state) => state.addTwoRivalPoints);
  const addThreeRivalPoints = useMarketStore(
    (state) => state.addThreeRivalPoints,
  );
  const substractOneRivalPoints = useMarketStore(
    (state) => state.substractOneRivalPoints,
  );

  const setRunning = useCronoStore((state) => state.setRunning);

  const handleAddRivalFoult = () => {
    setRunning(false);
    addRivalFoult();
  };

  return (
    <View className="w-22 flex flex-col">
      <Text className="text-xs text-center">Pts. Op.</Text>
      <TouchableOpacity
        className={`py-1 px-2 border`}
        onPress={addThreeRivalPoints}
      >
        <Text className=" text-xs text-center capitalize">+3</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`py-1 px-2 border`}
        onPress={addTwoRivalPoints}
      >
        <Text className="text-xs text-center capitalize">+2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`py-1 px-2 border`}
        onPress={addOneRivalPoints}
      >
        <Text className="text-xs text-center capitalize">+1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`py-1 px-2 border`}
        onPress={substractOneRivalPoints}
      >
        <Text className="text-xs text-center capitalize">-1</Text>
      </TouchableOpacity>
      <Text className=" text-xs text-center mt-1">Fal. Op.</Text>
      <TouchableOpacity
        className={`py-1 px-2 border `}
        onPress={handleAddRivalFoult}
      >
        <Text className="text-xs text-center capitalize">+1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`py-1 px-2 border `}
        onPress={substractRivalFoult}
      >
        <Text className="text-xs text-center capitalize">-1</Text>
      </TouchableOpacity>
    </View>
  );
});

export default RivalOptions;
