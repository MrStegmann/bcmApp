import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import Table from "../framework/Table";
import { useClubStore } from "../store/ClubStore";
import useDB from "../hooks/useDB";
import Button from "../framework/Button";
import Input from "../framework/Input";
import { useAlertStore } from "../store/AlertStore";

const TableHeader = ({ ref, onScroll }) => {
  return (
    <>
      <Text className="font-bold w-14 text-center">Conv.</Text>
      <Text className="font-bold w-10 text-center">Nº</Text>
      <Text className="font-bold w-32 text-left">Nombre</Text>
      <ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Text className="font-bold w-10 text-center border-x">Min</Text>
        <Text className="font-bold w-12 text-center border-x">Pts</Text>
        <Text className="font-bold w-12 text-center border-x">T1a</Text>
        <Text className="font-bold w-12 text-center border-x">T1i</Text>
        <Text className="font-bold w-12 text-center border-x">T1%</Text>
        <Text className="font-bold w-12 text-center border-x">T2a</Text>
        <Text className="font-bold w-12 text-center border-x">T2i</Text>
        <Text className="font-bold w-12 text-center border-x">T2%</Text>
        <Text className="font-bold w-12 text-center border-x">T3a</Text>
        <Text className="font-bold w-12 text-center border-x">T3i</Text>
        <Text className="font-bold w-12 text-center border-x">T3%</Text>
        <Text className="font-bold w-14 text-center border-x">D. Reb</Text>
        <Text className="font-bold w-14 text-center border-x">O. Reb</Text>
        <Text className="font-bold w-14 text-center border-x">T. Reb</Text>
        <Text className="font-bold w-14 text-center border-x">Asis</Text>
        <Text className="font-bold w-14 text-center border-x">Rec</Text>
        <Text className="font-bold w-14 text-center border-x">Per</Text>
        <Text className="font-bold w-14 text-center border-x">Falt</Text>
      </ScrollView>
    </>
  );
};

const TableBody = ({
  items,
  onChange,
  isCalled,
  syncScroll,
  scrollRefs,
  onScroll,
}) => {
  return items.map((item, index) => (
    <View
      key={item.id}
      className="w-full flex flex-row justify-between items-center border-b py-2 border-gray-300 px-5"
    >
      <View className="font-bold w-14 text-center">
        <Switch
          value={isCalled(item.id)}
          onValueChange={(state) => onChange(state, item.id)}
        />
      </View>
      <Text className="font-bold w-10 text-center">{item.number}</Text>
      <Text className="font-bold w-32 text-left">
        {item.first_name + " " + item.last_name}
      </Text>
      <ScrollView
        ref={(el) => (scrollRefs.current[index] = el)}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll} // Agrega onScroll aquí
        scrollEventThrottle={16}
      >
        <Text className="font-bold w-10 text-center border-x">
          {item.total_minutes || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {(item.total_t1a || 0) +
            (item.total_t2a * 2 || 0) +
            (item.total_t3a * 3 || 0)}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t1a || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t1i || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t1a / item.total_t1i || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t2a || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t2i || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t2a / item.total_t2i || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t3a || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t3i || 0}
        </Text>
        <Text className="font-bold w-12 text-center border-x">
          {item.total_t3a / item.total_t3i || 0}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {item.total_dreb || 0}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {item.total_oreb || 0}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {(item.total_dreb || 0) + (item.total_oreb * 2 || 0)}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {item.total_asis || 0}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {item.total_rec || 0}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {item.total_per || 0}
        </Text>
        <Text className="font-bold w-14 text-center border-x">
          {item.total_falt || 0}
        </Text>
      </ScrollView>
    </View>
  ));
};

const PlayerCard = ({ playerInf, onCall, isCalled }) => {
  const pts =
    playerInf.total_t1a + playerInf.total_t2a * 2 + playerInf.total_t3a * 3;
  const val =
    playerInf.total_t2a +
    playerInf.total_t3a +
    playerInf.total_t1a +
    (playerInf.total_dreb + playerInf.total_oreb) +
    playerInf.total_asis +
    playerInf.total_rec -
    playerInf.total_per -
    playerInf.total_falt -
    (playerInf.total_t2i - playerInf.total_t2a) -
    (playerInf.total_t3i - playerInf.total_t3a) -
    (playerInf.total_t1i - playerInf.total_t1a);
  return (
    <TouchableOpacity
      onPress={() => onCall(!isCalled(playerInf.id), playerInf.id)}
      className={`w-full flex flex-col bg-danish-red rounded-xl my-2 p-2 ${isCalled(playerInf.id) ? "border-4 border-danish-gold" : ""}`}
    >
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
            <Text className="text-danish-white">{`${pts}`}</Text>
          </View>
          <View className="w-full flex flex-row justify-between">
            <Text className="text-danish-white">Faltas</Text>
            <Text className="text-danish-white">{`${playerInf.total_falt || 0}`}</Text>
          </View>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${val}`}</Text>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row"></View>
    </TouchableOpacity>
  );
};

const GameForm = ({ gameData, onSubmit }) => {
  const { PlayerController, GameController } = useDB();
  // const addAlert = useAlertStore((state) => state.addAlert);
  const [opponent, setOpponent] = useState("Compactaciones");
  const [round, setRound] = useState("1");
  const [date, setDate] = useState("22/09/2025");
  const [calledup, setCalleup] = useState([]);

  const [players, setPlayers] = useState([]);

  const club = useClubStore((state) => state.club);

  const headerRef = useRef(null);
  const bodyScrollRefs = useRef([]);
  const scrolling = useRef(false);

  useEffect(() => {
    if (gameData) {
      setOpponent(gameData.opponent);
      setRound(gameData.round + "");
      setDate(gameData.date);
      PlayerController.loadStatsByTeam(gameData.team_id, setPlayers);
      GameController.loadCalledup(gameData.id, (result) =>
        setCalleup(result.map((res) => res.player_id))
      );
    }
  }, []);

  // useEffect(() => {
  //   PlayerController.loadStatsByTeam(club.id, setPlayers);
  // }, []);

  const handleSubmit = () => {
    if ([opponent, date, round].includes("")) return;
    const game = { id: gameData?.id, team_id: club.id, opponent, round, date };

    onSubmit(game, calledup);
  };

  const handleSetCalled = async (state, playerId) => {
    if (calledup.length === 12) return;
    await GameController.editCalledup({
      called: state,
      game_id: gameData.id,
      player_id: playerId,
    });
    if (state) {
      setCalleup((before) => [...before, playerId]);
    } else {
      setCalleup((before) => before.filter((cu) => cu !== playerId));
    }
  };

  const syncScroll = (currentRef, x) => {
    if (scrolling.current) {
      return;
    }
    scrolling.current = true;

    // Sincroniza el encabezado
    if (headerRef.current && headerRef.current !== currentRef) {
      headerRef.current.scrollTo({ x, animated: false });
    }

    // Sincroniza todas las filas
    bodyScrollRefs.current.forEach((ref) => {
      if (ref && ref !== currentRef) {
        ref.scrollTo({ x, animated: false });
      }
    });

    setTimeout(() => {
      scrolling.current = false;
    }, 100);
  };

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    syncScroll(e.target, x);
  };

  return (
    <View className="w-full px-5 flex-1">
      <Input
        label="Equipo Contrario"
        placeholder="Equipo contrario"
        value={opponent}
        onChange={setOpponent}
      />
      <View className="flex flex-row w-full gap-1 my-2">
        <View className="w-1/2">
          <Input
            label="Jornada"
            placeholder="Jornada"
            value={round}
            onChange={setRound}
            keyboardType="numeric"
          />
        </View>
        <View className="w-1/2">
          <Input
            label="Fecha"
            placeholder="Fecha"
            value={date}
            onChange={setDate}
            keyboardType="numeric"
          />
        </View>
      </View>

      {players.length > 0 && (
        <>
          <Text className="font-bold mt-2 text-center">
            Convocatoria{" "}
            {"( " + calledup.length + " jugadores convocados de 12 )"}
          </Text>
          <View className="w-full h-96 max-h-96 mb-5">
            <ScrollView
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
            >
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
      <Button
        title={gameData ? "Guardar" : "Añadir Partido"}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default GameForm;
