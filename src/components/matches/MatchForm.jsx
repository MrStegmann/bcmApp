import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native-web";
import { errorAlert, infoAlert } from "../../helpers/AlertHelper";
import { useTeamStore } from "../../store/TeamStore";
import { useNavigation } from "@react-navigation/native";
import { useMatchStore } from "../../store/MatchStore";
import { usePlayerStore } from "../../store/PlayerStore";
import DatePicker from "../../framework/DatePicker";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SaveButton from "../../framework/SaveButton";

const CalledPlayer = ({ data, onCallup }) => (
  <TouchableOpacity
    onPress={() => onCallup(data.playerId)}
    className={`mx-1 my-1 p-2 rounded-lg border-2 flex flex-col justify-center items-center relative ${data.called ? "border-danish-gold" : "border-danish-red"}`}
  >
    <Text>{data.label}</Text>
  </TouchableOpacity>
);

const MatchForm = ({ route }) => {
  const { onGoBack, match } = route.params;
  const [rival, setRival] = useState(match ? match.rival : "");
  const [round, setRound] = useState(match ? `${match.round}` : "");
  const [date, setDate] = useState(match ? new Date(match.date) : new Date());

  const [players, setPlayers] = useState([]);

  const team = useTeamStore((state) => state.team);
  const fetchPlayersByTeam = usePlayerStore(
    (state) => state.fetchPlayersByTeam,
  );

  const loading = useMatchStore((state) => state.loading);
  const saveMatch = useMatchStore((state) => state.saveMatch);
  const fetchRoaster = useMatchStore((state) => state.fetchRoaster);
  const saveCallup = useMatchStore((state) => state.saveCallup);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        let players;
        if (match && match?.id) {
          const roaster = await fetchRoaster(match.id);
          players = roaster.map((r) => ({
            id: r.id,
            label: `${r.player.number} - ${r.player.name} ${r.player.lastname}`,
            playerId: r.player.id,
            called: r.called,
          }));
        } else {
          const teamFeached = await fetchPlayersByTeam(team.id);
          players = teamFeached.map((player) => ({
            label: `${player.number} - ${player.name} ${player.lastname}`,
            playerId: player.id,
            called: false,
          }));
        }

        setPlayers(players);
      } catch (error) {
        setPlayers([]);
        errorAlert(error.message);
      }
    };
    fetchPlayers();
  }, []);

  const submit = async () => {
    if ([rival, round, date].includes(""))
      return errorAlert("Debes rellenar todos los campos");

    const matchData = {
      ...(match?.id != null && { id: match?.id }),
      rival,
      round,
      date,
      team,
    };
    try {
      const result = await saveMatch(matchData);
      const callup = players.map((p) => ({
        ...(p?.id != null && { id: p?.id }),
        player: { id: p.playerId },
        game: { id: result.id },
        called: p.called,
      }));

      await saveCallup(callup);

      infoAlert("Partido y convocatoria guardado exitosamente");
      reset();
      navigation.goBack();
      onGoBack();
    } catch (error) {
      errorAlert(error.message);
    }
  };

  const reset = () => {
    setRival("");
    setRound("");
    setDate("");
  };

  const handleCallup = (playerId) => {
    const idx = players.findIndex((p) => p.playerId === playerId);
    const found = { ...players.at(idx) };
    if (found) {
      found.called = !found.called;
      const newPlayers = [...players];
      newPlayers.splice(idx, 1, found);
      if (newPlayers.filter((p) => p.called).length > 12)
        return errorAlert("No puedes convocar a más de 12 jugadores");
      setPlayers(newPlayers);
    }
  };

  return (
    <View className="w-full flex-1 flex flex-col items-center px-5">
      <View className="flex flex-row justify-between items-center mt-5">
        <SaveButton onPress={submit} isLoading={loading} />
      </View>
      <TextInput
        placeholder="Oponente"
        value={rival}
        onChangeText={(value) => setRival(value)}
        className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
      />
      <TextInput
        placeholder="Jornada"
        value={round}
        onChangeText={(value) => setRound(value)}
        className="w-3/4 p-3 border border-gray-300 rounded-lg mt-5"
      />
      <DatePicker value={date} onChange={(value) => setDate(value)} />

      <Text className="font-bold mt-2 text-center">
        Convocatoria{" "}
        {"( " +
          players.filter((p) => p.called).length +
          " jugadores convocados de 12 )"}
      </Text>
      <View className="flex flex-row flex-wrap w-full">
        <FlatList
          data={players}
          scrollEnabled={false}
          keyExtractor={(item) => item.playerId.toString()}
          renderItem={({ item }) => (
            <CalledPlayer data={item} onCallup={handleCallup} />
          )}
        />
      </View>
    </View>
  );
};

export default MatchForm;
