import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useClubStore } from "../store/ClubStore";
import useDB from "../hooks/useDB";
import { Game, PlayerStat } from "../types/database";

interface PlayerStatDetail extends PlayerStat {
  first_name?: string;
  last_name?: string;
  number?: number;
  statId?: number;
  game_id?: number;
  player_id?: number;
}

interface PlayerCardProps {
  playerInf: PlayerStatDetail | null;
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const RowData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const PlayerCard: React.FC<PlayerCardProps> = ({
  playerInf,
  visible,
  onClose,
  onUpdated,
}) => {
  if (!playerInf) return null;
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

  const handleUpdate = () => {
    PlayerStatsController.edit({
      id: playerInf.statId || playerInf.id,
      game_id: club?.id || playerInf.game_id,
      player_id: playerInf.player_id || playerInf.id,
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
    onUpdated();
  };

  const percent: Record<string, number> = {
    t1Per:
      pt.t1a === "0" && pt.t1i === "0"
        ? 0
        : (Number(pt.t1a) / (Number(pt.t1i) || 1)) * 100,
    t2Per:
      pt.t2a === "0" && pt.t2i === "0"
        ? 0
        : (Number(pt.t2a) / (Number(pt.t2i) || 1)) * 100,
    t3Per:
      pt.t3a === "0" && pt.t3i === "0"
        ? 0
        : (Number(pt.t3a) / (Number(pt.t3i) || 1)) * 100,
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
    Math.max(0, Number(pt.t2i) - Number(pt.t2a)) -
    Math.max(0, Number(pt.t3i) - Number(pt.t3a)) -
    Math.max(0, Number(pt.t1i) - Number(pt.t1a));

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View className="w-full h-full flex justify-center items-center bg-black/80 px-4">
        <View className="w-full max-w-md bg-surface-container rounded-2xl border border-slate-border shadow-2xl p-5">
          <Text className="w-full text-center text-lg font-bold text-white mb-3">
            {playerInf.number}{" "}
            {`${playerInf.first_name || ""} ${playerInf.last_name || ""}`}
          </Text>

          <View className="w-full flex flex-row justify-between items-center mb-4">
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1.5 flex flex-col items-center justify-center">
              <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">Mins</Text>
              <TextInput
                className="text-center font-bold text-sm text-white w-12 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={minutes}
                onChangeText={setMinutes}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1.5 flex flex-col items-center justify-center">
              <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">PTS</Text>
              <Text className="text-court-orange font-bold text-sm">{`${pts}`}</Text>
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1.5 flex flex-col items-center justify-center">
              <Text className="text-on-surface-variant text-[11px] font-semibold uppercase">Val</Text>
              <Text className="text-tactical-blue-light font-bold text-sm">{`${val}`}</Text>
            </View>
          </View>

          <View className="w-full flex flex-row flex-wrap justify-between items-center gap-y-2">
            {[1, 2, 3].map((key) => (
              <RowData key={key}>
                <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col items-center justify-center">
                  <Text className="text-on-surface-variant text-[10px] font-semibold">T{key}A</Text>
                  <TextInput
                    className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                    keyboardType="numeric"
                    value={pt[`t${key}a` as keyof typeof pt]}
                    onChangeText={(valInput) =>
                      setPT((prev) => ({
                        ...prev,
                        [`t${key}a`]: valInput,
                      }))
                    }
                    selectTextOnFocus={true}
                  />
                </View>
                <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col items-center justify-center">
                  <Text className="text-on-surface-variant text-[10px] font-semibold">T{key}I</Text>
                  <TextInput
                    className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                    keyboardType="numeric"
                    value={pt[`t${key}i` as keyof typeof pt]}
                    onChangeText={(valInput) =>
                      setPT((prev) => ({
                        ...prev,
                        [`t${key}i`]: valInput,
                      }))
                    }
                    selectTextOnFocus={true}
                  />
                </View>
                <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col items-center justify-center">
                  <Text className="text-on-surface-variant text-[10px] font-semibold">T{key}%</Text>
                  <Text className="text-white font-bold text-xs">{`${(percent[`t${key}Per`] || 0).toFixed(0)}%`}</Text>
                </View>
              </RowData>
            ))}

            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col justify-center items-center">
              <Text className="text-on-surface-variant text-[10px] font-semibold">OReb</Text>
              <TextInput
                className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={oreb}
                onChangeText={setOReb}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col justify-center items-center">
              <Text className="text-on-surface-variant text-[10px] font-semibold">DReb</Text>
              <TextInput
                className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={dreb}
                onChangeText={setDReb}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col justify-center items-center">
              <Text className="text-on-surface-variant text-[10px] font-semibold">Asis</Text>
              <TextInput
                className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={asis}
                onChangeText={setAsis}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col justify-center items-center">
              <Text className="text-on-surface-variant text-[10px] font-semibold">Rec</Text>
              <TextInput
                className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={rec}
                onChangeText={setRec}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col justify-center items-center">
              <Text className="text-on-surface-variant text-[10px] font-semibold">PER</Text>
              <TextInput
                className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={per}
                onChangeText={setPer}
                selectTextOnFocus={true}
              />
            </View>
            <View className="w-16 border border-slate-border bg-slate-card rounded-lg p-1 flex flex-col justify-center items-center">
              <Text className="text-on-surface-variant text-[10px] font-semibold">FALT</Text>
              <TextInput
                className="text-center font-bold text-xs text-white w-10 px-1 bg-slate-dark border border-slate-border rounded"
                keyboardType="numeric"
                value={falt}
                onChangeText={setFalt}
                selectTextOnFocus={true}
              />
            </View>
          </View>

          <View className="w-full flex flex-row justify-between items-center px-2 mt-5 gap-3">
            <TouchableOpacity
              className="flex-1 min-h-[48px] px-4 py-3 bg-court-orange rounded-xl items-center justify-center active:bg-court-orange-dark shadow-md"
              onPress={handleUpdate}
            >
              <Text className="text-white font-bold">Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 min-h-[48px] px-4 py-3 bg-slate-dark border border-slate-border rounded-xl items-center justify-center active:bg-slate-card"
              onPress={onClose}
            >
              <Text className="text-on-surface font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export interface GameDetailProps {
  data: Partial<Game> & {
    result_c1?: number | string;
    result_c2?: number | string;
    result_c3?: number | string;
    result_c4?: number | string;
    result_extra?: number | string;
    result_c1_opponent?: number | string;
    result_c2_opponent?: number | string;
    result_c3_opponent?: number | string;
    result_c4_opponent?: number | string;
    result_extra_opponent?: number | string;
  };
  onUpdateResults?: (game: any) => void;
  onUpdateStats?: (stats: any) => void;
}

const GameDetail: React.FC<GameDetailProps> = ({ data, onUpdateResults }) => {
  if (!data) return null;
  const [clubResults, setClubResults] = useState<{ [key: string]: string }>({
    c1: "0",
    c2: "0",
    c3: "0",
    c4: "0",
    extra: "0",
  });
  const [opponentResults, setOpponentResults] = useState<{ [key: string]: string }>({
    c1: "0",
    c2: "0",
    c3: "0",
    c4: "0",
    extra: "0",
  });
  const [totalResult, setTotalResult] = useState("0");
  const [totalOpponentResult, setTotalOpponentResult] = useState("0");
  const [players_stats, setPlayers_Stats] = useState<PlayerStatDetail[]>([]);
  const [calledup, setCalleup] = useState<number[]>([]);
  const [playerDetails, setPlayerDetails] = useState<PlayerStatDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { PlayerController, GameController } = useDB();
  const club = useClubStore((state) => state.club);

  useEffect(() => {
    if (data?.result_c1 !== undefined) {
      setClubResults({
        c1: `${data.result_c1 ?? 0}`,
        c2: `${data.result_c2 ?? 0}`,
        c3: `${data.result_c3 ?? 0}`,
        c4: `${data.result_c4 ?? 0}`,
        extra: `${data.result_extra ?? 0}`,
      });
    }
    if (data?.result_c1_opponent !== undefined) {
      setOpponentResults({
        c1: `${data.result_c1_opponent ?? 0}`,
        c2: `${data.result_c2_opponent ?? 0}`,
        c3: `${data.result_c3_opponent ?? 0}`,
        c4: `${data.result_c4_opponent ?? 0}`,
        extra: `${data.result_extra_opponent ?? 0}`,
      });
    }
    setCalleup([]);
    if (data.id) {
      GameController.loadCalledup(data.id, (result: any[]) =>
        setCalleup((result || []).map((res) => res.player_id))
      );
    }
  }, [data]);

  const getPlayerStats = () => {
    if (calledup.length > 0 && data.id) {
      setPlayers_Stats([]);
      for (const playerId of calledup) {
        PlayerController.loadPlayerStats(playerId, data.id, (result: any) => {
          if (result) {
            setPlayers_Stats((before) => [...before, result]);
          }
        });
      }
    }
  };

  useEffect(() => {
    getPlayerStats();
  }, [calledup]);

  useEffect(() => {
    let result = 0;
    if (!isNaN(Number(clubResults.c1))) result += Number(clubResults.c1);
    if (!isNaN(Number(clubResults.c2))) result += Number(clubResults.c2);
    if (!isNaN(Number(clubResults.c3))) result += Number(clubResults.c3);
    if (!isNaN(Number(clubResults.c4))) result += Number(clubResults.c4);
    if (!isNaN(Number(clubResults.extra))) result += Number(clubResults.extra);
    setTotalResult(result + "");
  }, [clubResults]);

  useEffect(() => {
    let result = 0;
    if (!isNaN(Number(opponentResults.c1))) result += Number(opponentResults.c1);
    if (!isNaN(Number(opponentResults.c2))) result += Number(opponentResults.c2);
    if (!isNaN(Number(opponentResults.c3))) result += Number(opponentResults.c3);
    if (!isNaN(Number(opponentResults.c4))) result += Number(opponentResults.c4);
    if (!isNaN(Number(opponentResults.extra))) result += Number(opponentResults.extra);
    setTotalOpponentResult(result + "");
  }, [opponentResults]);

  const handleSaveResults = async (game: any) => {
    if (onUpdateResults) {
      onUpdateResults(game);
    }
  };

  const handleOpenPlayerDetails = (item: PlayerStatDetail) => {
    setPlayerDetails(item);
    setModalVisible(true);
  };

  const handleUpdatedPlayerDetails = () => {
    setModalVisible(false);
    setPlayerDetails(null);
    getPlayerStats();
  };

  const handleClosePlayerDetails = () => {
    setModalVisible(false);
    setPlayerDetails(null);
  };

  return (
    <View className="flex-1 px-2 h-full w-full">
      <PlayerCard
        playerInf={playerDetails}
        onClose={handleClosePlayerDetails}
        visible={modalVisible}
        onUpdated={handleUpdatedPlayerDetails}
      />

      <View className="mb-2 bg-slate-card border border-slate-border rounded-xl p-4 shadow-md">
        <Text className="text-center text-xs text-primary font-bold mb-2">
          Jornada {data.round} - {data.date}
        </Text>
        <View className="flex flex-row justify-between items-center w-full mb-2">
          <Text className="text-center font-bold text-white text-sm w-1/3">
            {club?.name || "Club"}
          </Text>
          <Text className="mx-2 font-bold text-on-surface-variant text-sm">vs</Text>
          <Text className="text-center font-bold text-white text-sm w-1/3">
            {data.opponent}
          </Text>
        </View>
        {["c1", "c2", "c3", "c4", "extra"].map((quarter) => (
          <View
            key={quarter}
            className="flex-row justify-between items-center py-1.5 border-b border-slate-border w-full"
          >
            <View className="w-1/3 flex justify-center items-center">
              <TextInput
                className="text-center font-bold text-sm text-white w-12 px-1 bg-slate-dark border border-slate-border rounded-lg min-h-[36px]"
                keyboardType="numeric"
                value={clubResults[quarter]}
                selectTextOnFocus={true}
                onChangeText={(value) =>
                  setClubResults({
                    ...clubResults,
                    [quarter]: value,
                  })
                }
                onEndEditing={() =>
                  handleSaveResults({
                    id: data.id,
                    team_id: club?.id,
                    opponent: data.opponent,
                    round: data.round,
                    date: data.date,
                    result_c1_opponent: opponentResults.c1,
                    result_c2_opponent: opponentResults.c2,
                    result_c3_opponent: opponentResults.c3,
                    result_c4_opponent: opponentResults.c4,
                    result_extra_opponent: opponentResults.extra,
                    result_c1: clubResults.c1,
                    result_c2: clubResults.c2,
                    result_c3: clubResults.c3,
                    result_c4: clubResults.c4,
                    result_extra: clubResults.extra,
                  })
                }
              />
            </View>

            <Text className="text-center font-bold text-sm text-on-surface-variant uppercase w-12">
              {quarter}
            </Text>
            <View className="w-1/3 flex justify-center items-center">
              <TextInput
                className="text-center font-bold text-sm text-white w-12 px-1 bg-slate-dark border border-slate-border rounded-lg min-h-[36px]"
                keyboardType="numeric"
                value={opponentResults[quarter]}
                selectTextOnFocus={true}
                onChangeText={(value) =>
                  setOpponentResults({
                    ...opponentResults,
                    [quarter]: value,
                  })
                }
                onEndEditing={() =>
                  handleSaveResults({
                    id: data.id,
                    team_id: club?.id,
                    opponent: data.opponent,
                    round: data.round,
                    date: data.date,
                    result_c1_opponent: opponentResults.c1,
                    result_c2_opponent: opponentResults.c2,
                    result_c3_opponent: opponentResults.c3,
                    result_c4_opponent: opponentResults.c4,
                    result_extra_opponent: opponentResults.extra,
                    result_c1: clubResults.c1,
                    result_c2: clubResults.c2,
                    result_c3: clubResults.c3,
                    result_c4: clubResults.c4,
                    result_extra: clubResults.extra,
                  })
                }
              />
            </View>
          </View>
        ))}
        <View className="flex-row justify-between items-center pt-2 mt-2">
          <Text className="flex-1 text-center font-extrabold text-sm text-court-orange">
            {totalResult}
          </Text>
          <Text className="flex-1 text-center font-bold text-sm text-on-surface-variant">
            Total
          </Text>
          <Text className="flex-1 text-center font-extrabold text-sm text-tactical-blue-light">
            {totalOpponentResult}
          </Text>
        </View>
      </View>

      <View className="w-full my-4">
        <ScrollView horizontal={false}>
          <View className="w-full flex flex-row flex-wrap justify-between items-center gap-2">
            {players_stats
              .sort((a, b) => (a.number || 0) - (b.number || 0))
              .map((ps) => {
                const isSelected = playerDetails?.id === ps.id;
                return (
                  <TouchableOpacity
                    key={ps.id}
                    onPress={() => handleOpenPlayerDetails(ps)}
                    className="active:opacity-80"
                  >
                    <View
                      className={`border rounded-xl w-28 p-2.5 min-h-[48px] items-center justify-center shadow-sm ${
                        isSelected
                          ? "bg-court-orange border-court-orange"
                          : "bg-slate-card border-slate-border"
                      }`}
                    >
                      <Text className={`text-xs font-bold text-center ${isSelected ? "text-slate-dark" : "text-white"}`}>
                        #{ps.number} {`${ps.first_name || ""} ${ps.last_name || ""}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default GameDetail;
