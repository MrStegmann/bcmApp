import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useClubStore } from "../store/ClubStore";
import useDB from "../hooks/useDB";
import Button from "../framework/Button";
import Input from "../framework/Input";
import { useAlertStore } from "../store/AlertStore";

interface PlayerCardProps {
  playerInf: any;
  onCall: (state: boolean, id: number) => void;
  isCalled: (id: number) => boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ playerInf, onCall, isCalled }) => {
  if (!playerInf) return null;
  const t1a = Number(playerInf.total_t1a || playerInf.t1a || 0);
  const t2a = Number(playerInf.total_t2a || playerInf.t2a || 0);
  const t3a = Number(playerInf.total_t3a || playerInf.t3a || 0);
  const pts = t1a + t2a * 2 + t3a * 3;

  const dreb = Number(playerInf.total_dreb || playerInf.dreb || 0);
  const oreb = Number(playerInf.total_oreb || playerInf.oreb || 0);
  const asis = Number(playerInf.total_asis || playerInf.asis || 0);
  const rec = Number(playerInf.total_rec || playerInf.rec || 0);
  const per = Number(playerInf.total_per || playerInf.per || 0);
  const falt = Number(playerInf.total_falt || playerInf.falt || 0);
  const t1i = Number(playerInf.total_t1i || playerInf.t1i || 0);
  const t2i = Number(playerInf.total_t2i || playerInf.t2i || 0);
  const t3i = Number(playerInf.total_t3i || playerInf.t3i || 0);

  const val =
    t2a +
    t3a +
    t1a +
    (dreb + oreb) +
    asis +
    rec -
    per -
    falt -
    Math.max(0, t2i - t2a) -
    Math.max(0, t3i - t3a) -
    Math.max(0, t1i - t1a);

  const number = playerInf.number || "";
  const firstName = playerInf.firstName || playerInf.first_name || "";
  const lastName = playerInf.lastName || playerInf.last_name || "";

  const called = isCalled(playerInf.id);

  return (
    <TouchableOpacity
      onPress={() => onCall(!called, playerInf.id)}
      className={`mx-1 my-1 p-2 rounded-lg bg-danish-dark-gray border-2 shadow-lg flex flex-col justify-center items-center relative ${called ? "border-danish-gold shadow-danish-gold" : "border-danish-red shadow-danish-red"}`}
    >
      <View className="absolute top-2 left-2">
        {called ? (
          <FontAwesome6 name="person-circle-check" size={18} color="gold" />
        ) : (
          <FontAwesome6 name="person-circle-exclamation" size={18} color="red" />
        )}
      </View>
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-1/3 flex flex-col px-2">
          <Text className="w-full text-danish-white text-center">
            {number}
          </Text>
          <Text className="w-full text-danish-white text-center">
            {`${firstName} ${lastName}`}
          </Text>
        </View>
        <View className="w-1/4 px-2 flex flex-col">
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">Mins</Text>
            <Text className="text-danish-white">{`${playerInf.total_minutes || playerInf.minutes || 0}`}</Text>
          </View>
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">PTS</Text>
            <Text className="text-danish-white">{`${pts}`}</Text>
          </View>
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">Faltas</Text>
            <Text className="text-danish-white">{`${falt}`}</Text>
          </View>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${val}`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface GameFormProps {
  gameData?: any;
  onSubmit: (game: any, calledup?: any[]) => void;
  onCancel?: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ gameData, onSubmit }) => {
  const { PlayerController, GameController } = useDB();
  const addAlert = useAlertStore((state) => state.addAlert);
  const [opponent, setOpponent] = useState("");
  const [wrongOpponent, setWrongOpponent] = useState("");
  const [round, setRound] = useState("");
  const [wrongRound, setWrongRound] = useState("");
  const [date, setDate] = useState("");
  const [wrongDate, setWrongDate] = useState("");
  const [calledup, setCalledup] = useState<number[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const club = useClubStore((state) => state.club);

  useEffect(() => {
    if (gameData) {
      setOpponent(gameData.opponent || "");
      setRound(gameData.round ? String(gameData.round) : "1");
      setDate(gameData.date || "");
      if (gameData.teamId || gameData.team_id) {
        PlayerController.loadStatsByTeam(gameData.teamId || gameData.team_id, setPlayers);
      }
      if (gameData.id) {
        GameController.loadCalledup(gameData.id, (result: any[]) =>
          setCalledup(result.map((res) => res.player_id || res.playerId))
        );
      }
    } else if (club?.id) {
      PlayerController.loadStatsByTeam(club.id, setPlayers);
    }
  }, [gameData, club]);

  useEffect(() => {
    setWrongOpponent("");
    setWrongDate("");
    setWrongRound("");
  }, [opponent, date, round]);

  const handleSubmit = () => {
    if (opponent === "") setWrongOpponent("Debe introducir el nombre del equipo contrincante");
    if (date === "") setWrongDate("Debe introducir la fecha del partido");
    if (round === "") setWrongRound("Debe introducir la jornada del partido");
    if ([opponent, date, round].includes("")) return;

    const game = {
      id: gameData?.id,
      teamId: club?.id || 1,
      opponent,
      round: Number(round) || 1,
      date,
    };

    onSubmit(game, calledup);
  };

  const handleSetCalled = async (state: boolean, playerId: number) => {
    if (state && calledup.length >= 12) {
      return addAlert("No puedes convocar a más de 12 jugadores");
    }
    if (gameData?.id) {
      await GameController.editCalledup({
        called: state,
        game_id: gameData.id,
        player_id: playerId,
      });
    }
    if (state) {
      setCalledup((before) => [...before, playerId]);
    } else {
      setCalledup((before) => before.filter((cu) => cu !== playerId));
    }
  };

  return (
    <View className="w-full px-5 h-full">
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

      <Text className="font-bold mt-2 text-center text-danish-white">
        {`Convocatoria ( ${calledup.length} jugadores convocados de 12 )`}
      </Text>
      <View className="w-full h-96 border-b border-danish-red mb-10">
        <ScrollView>
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              playerInf={player}
              onCall={handleSetCalled}
              isCalled={(playerId) => calledup.includes(playerId)}
            />
          ))}
        </ScrollView>
      </View>
      <Button
        title={gameData ? "Guardar" : "Añadir Partido"}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default GameForm;
