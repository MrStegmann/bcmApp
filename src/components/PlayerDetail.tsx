import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

import useDB from "../hooks/useDB";
import jersey from "../../assets/jersey.png";
import { db, games } from "../db";
import { eq } from "drizzle-orm";
import { Game } from "../types/database";
import { MatchDetailView } from "../features/match-detail";
import { formatPlayedMatch, EMPTY_PLAYED_MATCHES_MESSAGE } from "../utils/playerMatches";

const RowData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const PlayerCard: React.FC<{ playerInf: any }> = ({ playerInf }) => {
  const t1a = Number(playerInf.total_t1a || playerInf.t1a || 0);
  const t1i = Number(playerInf.total_t1i || playerInf.t1i || 0);
  const t2a = Number(playerInf.total_t2a || playerInf.t2a || 0);
  const t2i = Number(playerInf.total_t2i || playerInf.t2i || 0);
  const t3a = Number(playerInf.total_t3a || playerInf.t3a || 0);
  const t3i = Number(playerInf.total_t3i || playerInf.t3i || 0);

  const percent = {
    t1Per: t1a === 0 && t1i === 0 ? 0 : (t1a / Math.max(1, t1i)) * 100,
    t2Per: t2a === 0 && t2i === 0 ? 0 : (t2a / Math.max(1, t2i)) * 100,
    t3Per: t3a === 0 && t3i === 0 ? 0 : (t3a / Math.max(1, t3i)) * 100,
  };

  const pts = t1a + t2a * 2 + t3i * 3;
  const oreb = Number(playerInf.total_oreb || playerInf.oreb || 0);
  const dreb = Number(playerInf.total_dreb || playerInf.dreb || 0);
  const asis = Number(playerInf.total_asis || playerInf.asis || 0);
  const rec = Number(playerInf.total_rec || playerInf.rec || 0);
  const per = Number(playerInf.total_per || playerInf.per || 0);
  const falt = Number(playerInf.total_falt || playerInf.falt || 0);

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

  return (
    <View className="w-full px-5 mt-3">
      <View className="w-full flex flex-row justify-between items-center">
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <Text className="text-danish-white">Mins</Text>
          <Text className="text-danish-white">{`${playerInf.total_minutes || playerInf.minutes || 0}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">PTS</Text>
            <Text className="text-danish-white">{`${pts}`}</Text>
          </View>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
          <View className="w-full flex flex-col justify-center items-center">
            <Text className="text-danish-white">Val</Text>
            <Text className="text-danish-white">{`${val}`}</Text>
          </View>
        </View>
      </View>

      <View className="w-full flex flex-row flex-wrap justify-between items-center mt-5 gap-y-2">
        {[1, 2, 3].map((key) => (
          <RowData key={key}>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}A</Text>
              <Text className="text-danish-white">{`${playerInf[`total_t${key}a`] || playerInf[`t${key}a`] || 0}`}</Text>
            </View>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}I</Text>
              <Text className="text-danish-white">{`${playerInf[`total_t${key}i`] || playerInf[`t${key}i`] || 0}`}</Text>
            </View>
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="text-danish-white">T{key}%</Text>
              <Text className="text-danish-white">{`${(percent[`t${key}Per` as keyof typeof percent] || 0).toFixed(1)}%`}</Text>
            </View>
          </RowData>
        ))}

        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">OReb</Text>
          <Text className="text-danish-white">{`${oreb}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">DReb</Text>
          <Text className="text-danish-white">{`${dreb}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Asis</Text>
          <Text className="text-danish-white">{`${asis}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">Rec</Text>
          <Text className="text-danish-white">{`${rec}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">PER</Text>
          <Text className="text-danish-white">{`${per}`}</Text>
        </View>
        <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col justify-center items-center">
          <Text className="text-danish-white">FALT</Text>
          <Text className="text-danish-white">{`${falt}`}</Text>
        </View>
      </View>
    </View>
  );
};

export interface PlayerDetailProps {
  data: any;
  onReturn?: () => void;
}

const PlayerDetail: React.FC<PlayerDetailProps> = ({ data }) => {
  const { PlayerController, PlayerStatsController } = useDB();
  const [playerAllStats, setPlayerAllStats] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [playedMatches, setPlayedMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Game | null>(null);

  useEffect(() => {
    if (data?.id) {
      PlayerController.loadStats(data.id, (items: any[]) => {
        setPlayerAllStats(items);
      });
      PlayerStatsController.loadByPlayer(data.id, setStats);
      PlayerController.loadPlayedMatches(data.id, (matches: any[]) => {
        setPlayedMatches(matches);
      });
    }
  }, [data]);

  const handleOpenMatchDetail = async (matchItem: any) => {
    try {
      const [fullGame] = await db
        .select()
        .from(games)
        .where(eq(games.id, matchItem.gameId));
      if (fullGame) {
        setSelectedMatch(fullGame);
        return;
      }
    } catch {}

    setSelectedMatch({
      id: matchItem.gameId,
      teamId: data?.teamId || 1,
      opponent: matchItem.opponent,
      round: matchItem.round || "1",
      date: matchItem.date || "",
      status: matchItem.status || "pending",
      resultC1: matchItem.resultC1 ?? 0,
      resultC2: matchItem.resultC2 ?? 0,
      resultC3: matchItem.resultC3 ?? 0,
      resultC4: matchItem.resultC4 ?? 0,
      resultExtra: matchItem.resultExtra ?? 0,
      resultC1Opponent: matchItem.resultC1Opponent ?? 0,
      resultC2Opponent: matchItem.resultC2Opponent ?? 0,
      resultC3Opponent: matchItem.resultC3Opponent ?? 0,
      resultC4Opponent: matchItem.resultC4Opponent ?? 0,
      resultExtraOpponent: matchItem.resultExtraOpponent ?? 0,
      foulsC1: matchItem.foulsC1 ?? 0,
      foulsC2: matchItem.foulsC2 ?? 0,
      foulsC3: matchItem.foulsC3 ?? 0,
      foulsC4: matchItem.foulsC4 ?? 0,
      foulsExtra: matchItem.foulsExtra ?? 0,
      foulsC1Opponent: matchItem.foulsC1Opponent ?? 0,
      foulsC2Opponent: matchItem.foulsC2Opponent ?? 0,
      foulsC3Opponent: matchItem.foulsC3Opponent ?? 0,
      foulsC4Opponent: matchItem.foulsC4Opponent ?? 0,
      foulsExtraOpponent: matchItem.foulsExtraOpponent ?? 0,
      createdAt: new Date().toISOString(),
    });
  };

  if (selectedMatch) {
    return (
      <View className="w-full h-full">
        <MatchDetailView
          match={selectedMatch}
          onReturn={() => setSelectedMatch(null)}
        />
      </View>
    );
  }

  const firstName = data?.firstName || data?.first_name || "";
  const lastName = data?.lastName || data?.last_name || "";
  const jerseyName = data?.jerseyName || data?.jersey_name || "";

  return (
    <ScrollView
      className="w-full h-full flex-1"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full flex flex-col items-center">
        <View className="w-full flex flex-col px-5">
          <View className="w-full flex flex-row gap-2 h-12">
            <ImageBackground
              source={jersey}
              className="w-10 flex justify-center items-center"
            >
              <Text className="font-bold text-danish-white mt-4">
                {data?.number || ""}
              </Text>
            </ImageBackground>
            <View className="h-full flex justify-center">
              <Text className="font-bold text-danish-white text-lg">
                {`${firstName} ${lastName}`}
              </Text>
              {jerseyName ? (
                <Text className="text-danish-white/70 text-xs font-semibold uppercase">
                  {jerseyName}
                </Text>
              ) : null}
            </View>
          </View>
          <View className="w-full mt-2 flex flex-row flex-wrap gap-2">
            <View className="w-14 border border-danish-red rounded-lg p-1 flex flex-col items-center justify-center">
              <Text className="font-bold text-danish-white">P. J</Text>
              <Text className="font-bold text-danish-white">{`${playedMatches.length || stats.length}`}</Text>
            </View>
          </View>
        </View>

        {playerAllStats.length > 0 ? (
          <PlayerCard playerInf={playerAllStats[0]} />
        ) : (
          <View className="w-full h-20 flex justify-center items-center mt-5">
            <Text className="font-bold text-danish-white">
              Aún no hay registro de ninguna estadística
            </Text>
          </View>
        )}

        {/* Played Matches List situated directly beneath global statistics */}
        <View className="w-full px-5 mt-6">
          <View className="w-full flex flex-row justify-between items-center mb-1">
            <Text className="font-bold text-danish-white text-base">
              Partidos Jugados
            </Text>
            <View className="px-2 py-0.5 rounded-full bg-danish-red/20 border border-danish-red/40">
              <Text className="text-danish-white text-xs font-bold">
                {playedMatches.length}
              </Text>
            </View>
          </View>

          {playedMatches.length === 0 ? (
            <View className="w-full p-4 mt-2 rounded-xl border border-danish-red/30 bg-danish-dark/60 items-center justify-center">
              <Text className="text-danish-white/80 text-center text-sm font-medium">
                {EMPTY_PLAYED_MATCHES_MESSAGE}
              </Text>
            </View>
          ) : (
            <View className="w-full flex flex-col gap-2.5 mt-2">
              {playedMatches.map((m: any) => {
                const item = formatPlayedMatch(m);
                return (
                  <View
                    key={m.gameId}
                    className="w-full bg-danish-dark/90 border border-danish-red/40 rounded-xl p-3 flex flex-row items-center justify-between"
                  >
                    <View className="flex-1 pr-3">
                      <Text
                        className="font-bold text-danish-white text-base"
                        numberOfLines={1}
                      >
                        {item.opponentDisplay}
                      </Text>
                      <View className="flex flex-row items-center gap-2 mt-1">
                        <Text className="text-danish-white/70 text-xs font-medium">
                          {item.roundDisplay}
                        </Text>
                        {item.date ? (
                          <>
                            <Text className="text-danish-white/40 text-xs">•</Text>
                            <Text className="text-danish-white/70 text-xs font-medium">
                              {item.date}
                            </Text>
                          </>
                        ) : null}
                      </View>
                    </View>

                    <View className="flex flex-row items-center gap-2">
                      {item.scoreDisplay ? (
                        <View className="px-2 py-1 rounded bg-black/40 border border-danish-red/30">
                          <Text className="text-danish-white font-bold text-xs">
                            {item.scoreDisplay}
                          </Text>
                        </View>
                      ) : null}

                      <TouchableOpacity
                        testID={`match-detail-btn-${m.gameId}`}
                        onPress={() => handleOpenMatchDetail(m)}
                        className="w-8 h-8 rounded-full bg-danish-red/20 border border-danish-red items-center justify-center active:bg-danish-red/40"
                      >
                        <Entypo name="chevron-right" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default PlayerDetail;
