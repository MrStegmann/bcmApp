import { useEffect, useMemo, useState } from "react";
import { Text, View, TextInput, ScrollView } from "react-native";
import Button from "../framework/Button";
import { useClubStore } from "../store/ClubStore";
import Game from "../models/Game";
import useDB from "../hooks/useDB";

const RowData = ({ children }) => {
  return <>{children}</>;
};

const PlayerCard = ({ playerInf }) => {
  const { PlayerStatsController } = useDB();
  const club = useClubStore((state) => state.club);
  const [minutes, setMinutes] = useState(`${playerInf.minutes || 0}`);
  const [pt, setPT] = useState({
    t1a: `${playerInf.t1a || 0}`,
    t1i: `${playerInf.t1i || 0}`,
    t2a: `${playerInf.t2a || 0}`,
    t2i: `${playerInf.t2i || 0}`,
    t3a: `${playerInf.t3a || 0}`,
    t3i: `${playerInf.t3i || 0}`,
  });
  const [dreb, setDReb] = useState(`${playerInf.dreb || 0}`);
  const [oreb, setOReb] = useState(`${playerInf.oreb || 0}`);
  const [asis, setAsis] = useState(`${playerInf.asis || 0}`);
  const [rec, setRec] = useState(`${playerInf.rec || 0}`);
  const [per, setPer] = useState(`${playerInf.per || 0}`);
  const [falt, setFalt] = useState(`${playerInf.falt || 0}`);

  useMemo(() => {
    PlayerStatsController.edit({
      id: playerInf.statId,
      game_id: club.id,
      player_id: playerInf.id,
      minutes: Number(minutes),
      t1a: Number(pt.t1a),
      t1i: Number(pt.t1i),
      t2a: Number(pt.t2a),
      t2i: Number(pt.t2i),
      t3a: Number(pt.t3a),
      t3i: Number(pt.t3i),
      dreb: Number(dreb),
      oreb: Number(oreb),
      asis: Number(asis),
      rec: Number(rec),
      per: Number(per),
      falt: Number(falt),
    });
  }, [minutes, pt, dreb, oreb, asis, rec, per, falt]);

  const percent = {
    t1Per:
      pt.t1a === "0" && pt.t1i === "0"
        ? 0
        : (Number(pt.t1a) / Number(pt.t1i)) * 100,
    t2Per:
      pt.t2a === "0" && pt.t2i === "0"
        ? 0
        : (Number(pt.t2a) / Number(pt.t2i)) * 100,
    t3Per:
      pt.t3a === "0" && pt.t3i === "0"
        ? 0
        : (Number(pt.t3a) / Number(pt.t3i)) * 100,
  };
  const pts = Number(pt.t1a) + Number(pt.t2a) * 2 + Number(pt.t3a) * 3;
  const val =
    Number(pt.t2a) +
    Number(pt.t3a) +
    Number(pt.t1a) +
    (Number(dreb) + Number(oreb)) +
    Number(asis) +
    Number(rec) -
    Number(per) -
    Number(falt) -
    (Number(pt.t2i) - Number(pt.t2a)) -
    (Number(pt.t3i) - Number(pt.t3a)) -
    (Number(pt.t1i) - Number(pt.t1a));

  return (
    <View className={`w-80 flex flex-col bg-danish-red rounded-xl p-2 mx-2`}>
      <View className="w-full flex flex-row justify-between items-center mb-1">
        <View className="w-1/2 flex flex-col px-2 items-center justify-center">
          <Text className="w-full text-danish-white text-center text-sm">
            {playerInf.number}{" "}
            {playerInf.first_name + " " + playerInf.last_name}
          </Text>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white text-sm">PTS</Text>
            <Text className="text-danish-white text-sm">{`${pts}`}</Text>
          </View>
        </View>
        <View className="w-1/4">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white text-sm">Val</Text>
            <Text className="text-danish-white text-sm">{`${val}`}</Text>
          </View>
        </View>
      </View>
      <View className="w-full flex flex-row flex-wrap mb-1 gap-y-1">
        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">Mins</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={minutes}
            onChangeText={setMinutes}
            selectTextOnFocus={true}
          />
        </View>
        {[1, 2, 3].map((key) => (
          <RowData key={key}>
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">T{key}A</Text>
              <TextInput
                className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
                keyboardType="numeric"
                value={pt[`t${key}a`]}
                onChangeText={(value) =>
                  setPT({
                    ...pt,
                    [`t${key}a`]: value,
                  })
                }
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">T{key}I</Text>
              <TextInput
                className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
                keyboardType="numeric"
                value={pt[`t${key}i`]}
                onChangeText={(value) => setPT({ ...pt, [`t${key}i`]: value })}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-1/4 flex flex-col justify-center items-center">
              <Text className="text-danish-white text-sm">T{key}%</Text>
              <View className="w-full flex justify-center items-center h-10">
                <Text className="text-danish-white text-sm ">{`${percent[`t${key}Per`].toFixed(1) || 0}%`}</Text>
              </View>
            </View>
          </RowData>
        ))}

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">OReb</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={oreb}
            onChangeText={setOReb}
            selectTextOnFocus={true}
          />
        </View>
        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">DReb</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={dreb}
            onChangeText={setDReb}
            selectTextOnFocus={true}
          />
        </View>

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">Asis</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={asis}
            onChangeText={setAsis}
            selectTextOnFocus={true}
          />
        </View>

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">Rec</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={rec}
            onChangeText={setRec}
            selectTextOnFocus={true}
          />
        </View>

        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">PER</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={per}
            onChangeText={setPer}
            selectTextOnFocus={true}
          />
        </View>
        <View className="w-1/4 flex flex-col justify-center items-center">
          <Text className="text-danish-white text-sm">FALT</Text>
          <TextInput
            className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
            keyboardType="numeric"
            value={falt}
            onChangeText={setFalt}
            selectTextOnFocus={true}
          />
        </View>
      </View>
    </View>
  );
};

const GameDetail = ({ data, onUpdateResults, onUpdateStats }) => {
  if (!data) return;
  const [clubResults, setClubResults] = useState({
    c1: "0",
    c2: "0",
    c3: "0",
    c4: "0",
    extra: "0",
  });
  const [opponentResults, setOpponentResults] = useState({
    c1: "0",
    c2: "0",
    c3: "0",
    c4: "0",
    extra: "0",
  });
  const [totalResult, setTotalResult] = useState("0");
  const [totalOpponentResult, setTotalOpponentResult] = useState("0");
  const [players_stats, setPlayers_Stats] = useState([]);
  const [calledup, setCalleup] = useState([]);

  const { PlayerController, GameController } = useDB();

  const club = useClubStore((state) => state.club);

  useEffect(() => {
    if (data?.result_c1) {
      setClubResults({
        c1: data.result_c1 + "",
        c2: data.result_c2 + "",
        c3: data.result_c3 + "",
        c4: data.result_c4 + "",
        extra: data.result_extra + "",
      });
    }
    if (data?.result_c1_opponent) {
      setOpponentResults({
        c1: data.result_c1_opponent + "",
        c2: data.result_c2_opponent + "",
        c3: data.result_c3_opponent + "",
        c4: data.result_c4_opponent + "",
        extra: data.result_extra_opponent + "",
      });
    }
    setCalleup([]);
    GameController.loadCalledup(data.id, (result) =>
      setCalleup(result.map((res) => res.player_id))
    );
  }, [data]);

  useEffect(() => {
    if (calledup.length > 0) {
      setPlayers_Stats([]);
      for (const playerId of calledup) {
        PlayerController.loadPlayerStats(playerId, data.id, (result) =>
          setPlayers_Stats((before) => [...before, result])
        );
      }
    }
  }, [calledup]);

  useEffect(() => {
    let result = 0;
    if (!isNaN(clubResults.c1)) result += Number(clubResults.c1);
    if (!isNaN(clubResults.c2)) result += Number(clubResults.c2);
    if (!isNaN(clubResults.c3)) result += Number(clubResults.c3);
    if (!isNaN(clubResults.c4)) result += Number(clubResults.c4);
    if (!isNaN(clubResults.extra)) result += Number(clubResults.extra);
    setTotalResult(result + "");
  }, [clubResults]);

  useEffect(() => {
    let result = 0;
    if (!isNaN(opponentResults.c1)) result += Number(opponentResults.c1);
    if (!isNaN(opponentResults.c2)) result += Number(opponentResults.c2);
    if (!isNaN(opponentResults.c3)) result += Number(opponentResults.c3);
    if (!isNaN(opponentResults.c4)) result += Number(opponentResults.c4);
    if (!isNaN(opponentResults.extra)) result += Number(opponentResults.extra);
    setTotalOpponentResult(result + "");
  }, [opponentResults]);

  const handleSaveResults = async () => {
    const game = new Game(data);
    game.setResults(clubResults, opponentResults);
    onUpdateResults(game);
  };
  const handleUpdateScore = async (item, key, value) => {
    const updatedItem = { ...item };
    if (updatedItem[key] !== null) {
      updatedItem[key] = value;

      setPlayers_Stats((before) => {
        const bef = [...before];
        const idx = bef.findIndex((b) => b.id === item.id);

        bef.splice(idx, 1, updatedItem);
        return bef;
      });
    }
  };
  return (
    <View className="flex-1 px-2 h-full w-full">
      <View className="mb-2 bg-danish-red rounded-lg p-4 shadow">
        <Text className="text-center text-xs text-danish-white mb-2">
          Jornada {data.round} - {data.date}
        </Text>
        <View className="flex flex-row justify-between items-center w-full">
          <Text className="text-center font-bold text-danish-white text-sm w-1/3">
            {club.name}
          </Text>
          <Text className="mx-2 font-bold text-danish-white text-sm">vs</Text>
          <Text className="text-center font-bold text-danish-white text-sm w-1/3">
            {data.opponent}
          </Text>
        </View>
        {["c1", "c2", "c3", "c4", "extra"].map((quarter) => (
          <View
            key={quarter}
            className="flex-row justify-between items-center py-1 border-b border-danish-white w-full"
          >
            <View className="w-1/3 flex justify-center items-center">
              <TextInput
                className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
                keyboardType="numeric"
                value={clubResults[quarter]}
                onChangeText={(value) =>
                  setClubResults({
                    ...clubResults,
                    [quarter]: value,
                  })
                }
              />
            </View>

            <Text className="text-center font-bold text-sm text-danish-white uppercase w-12">
              {quarter}
            </Text>
            <View className="w-1/3 flex justify-center items-center">
              <TextInput
                className="text-center font-bold text-sm text-danish-red w-12 px-1 bg-danish-white rounded-lg"
                keyboardType="numeric"
                value={opponentResults[quarter]}
                onChangeText={(value) =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: value,
                  })
                }
              />
            </View>
          </View>
        ))}
        <View className="flex-row justify-between items-center pt-2 mt-2">
          <Text className="flex-1 text-center font-bold text-sm text-danish-white">
            {totalResult}
          </Text>
          <Text className="flex-1 text-center font-bold text-sm text-danish-white">
            Total
          </Text>
          <Text className="flex-1 text-center font-bold text-sm text-danish-white">
            {totalOpponentResult}
          </Text>
        </View>
      </View>

      <Button title={"Guardar Resultados"} onPress={handleSaveResults} />

      {/* Sección de la tabla de estadísticas */}
      <View className="w-full my-5">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          {players_stats.map((ps) => (
            <PlayerCard key={ps.id} playerInf={ps} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default GameDetail;
