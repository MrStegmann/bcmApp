import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import StorageEnums from "../../Enums/StorageEnums";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";
import { usePlayPlayersStore } from "../../store/MatchStore";
import { useLocalStore } from "../../store/LocalStore";

const quarters = ["c1", "c2", "c3", "c4", "extra"];

const Quarter = React.memo(({ q, onSelect, quarter }) => {
  return (
    <TouchableOpacity
      key={q}
      onPress={() => onSelect(q)}
      className={`px-2 py-1 border ${quarter === q ? "border-blue-600" : "border-black"}`}
    >
      <Text className="text-sm capitalize">{q}</Text>
    </TouchableOpacity>
  );
});

const SettingMatch = ({ match, onClose }) => {
  const [config, setConfig] = useState({
    c1: [],
    c2: [],
    c3: [],
    c4: [],
    extra: [],
  });
  const [quarter, setQuarter] = useState("c1");
  const [roaster, setRoaster] = useState([]);

  const fetchRoasterByMatch = usePlayPlayersStore(
    (state) => state.fetchRoasterByMatch,
  );
  const storeData = useLocalStore((state) => state.storeData);
  const getData = useLocalStore((state) => state.getData);
  useEffect(() => {
    loadRoaster();
    loadStorage();
  }, []);
  const loadRoaster = async () => {
    try {
      const result = await fetchRoasterByMatch(match.id);
      const players = Object.values(result);
      if (players.length === 0)
        throw new Error("No hay jugadores para este partido");

      setRoaster(players);
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const loadStorage = async () => {
    try {
      const data = await getData(StorageEnums.QUINTET_STORAGE);
      if (data) {
        setConfig(data);
      }
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const handleAddToQuintet = (playerId) => {
    if (config[quarter].length === 5)
      return infoAlert("Tu no puedes añadir más jugadores al quinteto");
    setConfig({ ...config, [quarter]: [...config[quarter], `${playerId}`] });
  };

  const handleRemoveFromQuintet = (playerId) => {
    setConfig({
      ...config,
      [quarter]: config[quarter].filter((plId) => plId !== playerId),
    });
  };

  const handleSaveConfig = async () => {
    try {
      await storeData(StorageEnums.QUINTET_STORAGE, config);

      onClose();
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const handleReset = () => {
    setConfig({
      c1: [],
      c2: [],
      c3: [],
      c4: [],
      extra: [],
    });
  };
  return (
    <View className="w-full h-full flex flex-col justify-center items-center bg-gray-50 px-4">
      <TouchableOpacity
        onPress={handleReset}
        className="px-1 py-2 rounded-lg border"
      >
        <Text>Reiniciar</Text>
      </TouchableOpacity>
      <View className="flex flex-row my-2">
        {quarters.map((q) => (
          <Quarter key={q} q={q} onSelect={setQuarter} quarter={quarter} />
        ))}
      </View>
      <View className="flex flex-row justify-between my-2">
        <FlatList
          contentContainerStyle={{ gap: 5 }}
          className={"w-1/4 px-2"}
          data={config[quarter]}
          scrollEnabled={false}
          keyExtractor={(item) => item.toString()}
          ListHeaderComponent={() => (
            <View>
              <Text>Quinteto</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-1 py-2 rounded-lg border"
              onPress={() => handleRemoveFromQuintet(item)}
            >
              <Text>
                {roaster.find((pl) => pl.id == item)?.number} -{" "}
                {roaster.find((pl) => pl.id == item)?.name}
              </Text>
            </TouchableOpacity>
          )}
        />
        <FlatList
          contentContainerStyle={{ gap: 5 }}
          className={"w-1/4 px-2"}
          data={roaster.filter((pl) => !config[quarter].includes(`${pl.id}`))}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <View>
              <Text>Convocados</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="px-1 py-2 rounded-lg border"
              onPress={() => handleAddToQuintet(item.id)}
            >
              <Text>
                {item.number} - {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="w-full flex flex-row justify-between">
        <TouchableOpacity
          onPress={onClose}
          className="px-2 py-3 border rounded-lg mb-2"
        >
          <Text className="font-bold">Cerrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSaveConfig}
          className="px-2 py-3 border rounded-lg mb-2"
        >
          <Text className="font-bold">Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingMatch;
