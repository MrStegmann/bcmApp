import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useClubStore } from "../store/ClubStore";
import useDB from "../hooks/useDB";
import Input from "../framework/Input";
import { useAlertStore } from "../store/AlertStore";
import { useMenuStore } from "../store/MenuStore";
import TopMenuEnums from "../Enums/TopMenuEnums";

const PlayerCard = ({ playerInf, onCall, isCalled }) => {
  return (
    <TouchableOpacity
      onPress={() => onCall(!isCalled(playerInf.id), playerInf.id)}
      className={`mx-1 my-1 p-2 rounded-lg bg-danish-dark-gray border-2 shadow-lg flex flex-col justify-center items-center relative ${isCalled(playerInf.id) ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
    >
      <View className="absolute top-2 left-2">
        {isCalled(playerInf.id) ? (
          <FontAwesome6 name="person-circle-check" size={18} color="gold" />
        ) : (
          <FontAwesome6
            name="person-circle-exclamation"
            size={18}
            color="red"
          />
        )}
      </View>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-1/3 flex flex-col px-2">
          <Text className="w-full text-danish-white text-center">
            {playerInf.number}
          </Text>
          <Text className="w-full text-danish-white text-center">
            {playerInf.first_name + " " + playerInf.last_name}
          </Text>
        </View>
        <View className="w-1/4 px-2 flex flex-col">
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">Mins</Text>
            <Text className="text-danish-white">{`${playerInf.total_minutes || 0}`}</Text>
          </View>
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">PTS</Text>
            <Text className="text-danish-white">{`${playerInf.total_pts}`}</Text>
          </View>
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">Faltas</Text>
            <Text className="text-danish-white">{`${playerInf.total_falt || 0}`}</Text>
          </View>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${playerInf.total_val}`}</Text>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row"></View>
    </TouchableOpacity>
  );
};

const GameForm = ({ gameData, onSubmit, onCancel }) => {
  const { PlayerController, GameController } = useDB();
  const addAlert = useAlertStore((state) => state.addAlert);
  const setTopMenu = useMenuStore((state) => state.setTopMenu);
  const [opponent, setOpponent] = useState("");
  const [wrongOpponent, setWrongOpponent] = useState("");
  const [round, setRound] = useState("");
  const [wrongRound, setWrongRound] = useState("");
  const [date, setDate] = useState("");
  const [wrongDate, setWrongDate] = useState("");
  const [calledup, setCalleup] = useState([]);

  const [players, setPlayers] = useState([]);

  const club = useClubStore((state) => state.club);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTopMenu([
        {
          id: TopMenuEnums.SAVE,
          name: "Guardar",
          onPress: () => handleSubmit(),
          icon: TopMenuEnums.SAVE,
        },
        {
          id: TopMenuEnums.GO_BACK,
          name: "Volver",
          onPress: onCancel,
          icon: TopMenuEnums.GO_BACK,
        },
      ]);
    }, 25);
    return () => clearTimeout(timeout);
  }, [opponent, round, date, calledup]);
  useEffect(() => {
    if (gameData) {
      setOpponent(gameData.opponent);
      setRound(gameData.round + "");
      setDate(gameData.date);
      const getData = async () => {
        setPlayers(await PlayerController.loadStatsByTeam(gameData.team_id));
        const RESULT_CALLEDUP = await GameController.loadCalledup(gameData.id);
        setCalleup(RESULT_CALLEDUP.map((res) => res.player_id));
      };
      getData();
    }
  }, []);

  useEffect(() => {
    setWrongOpponent("");
    setWrongDate("");
    setWrongRound("");
  }, [opponent, date, round]);

  const handleSubmit = () => {
    if (opponent === "")
      setWrongOpponent("Debe instroducir el nombre del equipo contrincante");
    if (date === "") setWrongDate("Debe instroducir la fecha del partido");
    if (round === "") setWrongRound("Debe instroducir la jornada del partido");
    if ([opponent, date, round].includes("")) return;
    const game = { id: gameData?.id, team_id: club.id, opponent, round, date };

    onSubmit(game, calledup);
  };

  const handleSetCalled = async (state, playerId) => {
    if (state) {
      if (calledup.length === 12)
        return addAlert({
          msg: "No puedes convocar a más de 12 jugadores",
          lifetime: 2500,
          id: Date.now(),
        });
      await GameController.editCalledup({
        called: state,
        game_id: gameData.id,
        player_id: playerId,
      });
      setCalleup((before) => [...before, playerId]);
    } else {
      setCalleup((before) => before.filter((cu) => cu !== playerId));
    }
  };

  return (
    <View className="w-full px-5 flex-1">
      <Input
        label="Equipo Contrario"
        placeholder="Equipo contrario"
        value={opponent}
        onChange={setOpponent}
        wrongMsg={wrongOpponent}
      />
      <View className="flex flex-row w-full gap-1 my-2">
        <View className="w-1/2">
          <Input
            label="Jornada"
            placeholder="Jornada"
            value={round}
            onChange={setRound}
            keyboardType="numeric"
            wrongMsg={wrongRound}
          />
        </View>
        <View className="w-1/2">
          <Input
            label="Fecha"
            placeholder="Fecha"
            value={date}
            onChange={setDate}
            type="date"
            keyboardType="numeric"
            wrongMsg={wrongDate}
          />
        </View>
      </View>

      {players.length > 0 && (
        <>
          <Text className="font-bold mt-2 text-center text-danish-white">
            Convocatoria{" "}
            {"( " + calledup.length + " jugadores convocados de 12 )"}
          </Text>
          <View className="w-full h-full">
            <ScrollView>
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  playerInf={player}
                  onCall={handleSetCalled}
                  isCalled={(playerId) =>
                    calledup.find((cu) => cu === playerId)
                  }
                />
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

export default GameForm;
