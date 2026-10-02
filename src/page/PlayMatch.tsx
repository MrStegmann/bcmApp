import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useClubStore } from "../store/ClubStore";
import useDB from "../hooks/useDB";
import { Game, PlayerStat } from "../types/database";
import Button from "../framework/Button";

interface PlayMatchProps {
  match: Game;
  onFinishMatch: () => void;
  onReturn: () => void;
}

type QuarterKey = "c1" | "c2" | "c3" | "c4" | "extra";

const PlayMatch: React.FC<PlayMatchProps> = ({
  match,
  onFinishMatch,
  onReturn,
}) => {
  const { GameController, PlayerController, PlayerStatsController } = useDB();
  const club = useClubStore((state) => state.club);

  const [currentMatch, setCurrentMatch] = useState<Game>(match);
  const [activeQuarter, setActiveQuarter] = useState<QuarterKey>("c1");

  // Chronograph State
  const [seconds, setSeconds] = useState<number>(600); // 10 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Scores State
  const [clubScores, setClubScores] = useState({
    c1: match.resultC1 ?? 0,
    c2: match.resultC2 ?? 0,
    c3: match.resultC3 ?? 0,
    c4: match.resultC4 ?? 0,
    extra: match.resultExtra ?? 0,
  });

  const [opponentScores, setOpponentScores] = useState({
    c1: match.resultC1Opponent ?? 0,
    c2: match.resultC2Opponent ?? 0,
    c3: match.resultC3Opponent ?? 0,
    c4: match.resultC4Opponent ?? 0,
    extra: match.resultExtraOpponent ?? 0,
  });

  // Roster & Live Stats
  const [rosterStats, setRosterStats] = useState<any[]>([]);
  const [finishModalVisible, setFinishModalVisible] = useState(false);

  useEffect(() => {
    loadMatchStats();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [match.id]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const loadMatchStats = async () => {
    const calledup = await GameController.loadCalledup(match.id);
    const loaded: any[] = [];
    for (const item of calledup) {
      const pid = item.player_id || item.playerId;
      const stat = await PlayerStatsController.getAll(match.id);
      const pStat = stat[pid];
      const playerList = await PlayerController.getAll(match.teamId);
      const player = playerList.find((p) => p.id === pid);
      loaded.push({
        id: pid,
        firstName: player?.firstName || "Jugador",
        lastName: player?.lastName || "",
        number: player?.number || "0",
        minutes: pStat?.minutes || 0,
        t1a: pStat?.t1a || 0,
        t1i: pStat?.t1i || 0,
        t2a: pStat?.t2a || 0,
        t2i: pStat?.t2i || 0,
        t3a: pStat?.t3a || 0,
        t3i: pStat?.t3i || 0,
        falt: pStat?.falt || 0,
        oreb: pStat?.oreb || 0,
        dreb: pStat?.dreb || 0,
        asis: pStat?.asis || 0,
        rec: pStat?.rec || 0,
        per: pStat?.per || 0,
      });
    }
    setRosterStats(loaded);
  };

  const handleToggleTimer = async () => {
    // If starting timer and match was pending, transition to inProgress
    if (!isTimerRunning && currentMatch.status === "pending") {
      await GameController.startMatch(currentMatch.id);
      setCurrentMatch((prev) => ({ ...prev, status: "inProgress" }));
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = (newSeconds: number = 600) => {
    setIsTimerRunning(false);
    setSeconds(newSeconds);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalClubScore =
    clubScores.c1 + clubScores.c2 + clubScores.c3 + clubScores.c4 + clubScores.extra;
  const totalOpponentScore =
    opponentScores.c1 +
    opponentScores.c2 +
    opponentScores.c3 +
    opponentScores.c4 +
    opponentScores.extra;

  const handleAdjustClubScore = (points: number) => {
    setClubScores((prev) => {
      const current = prev[activeQuarter];
      const updated = Math.max(0, current + points);
      const nextScores = { ...prev, [activeQuarter]: updated };
      saveCurrentScores(nextScores, opponentScores);
      return nextScores;
    });
  };

  const handleAdjustOpponentScore = (points: number) => {
    setOpponentScores((prev) => {
      const current = prev[activeQuarter];
      const updated = Math.max(0, current + points);
      const nextScores = { ...prev, [activeQuarter]: updated };
      saveCurrentScores(clubScores, nextScores);
      return nextScores;
    });
  };

  const saveCurrentScores = async (cScores: typeof clubScores, oScores: typeof opponentScores) => {
    await GameController.edit({
      id: currentMatch.id,
      result_c1: cScores.c1,
      result_c2: cScores.c2,
      result_c3: cScores.c3,
      result_c4: cScores.c4,
      result_extra: cScores.extra,
      result_c1_opponent: oScores.c1,
      result_c2_opponent: oScores.c2,
      result_c3_opponent: oScores.c3,
      result_c4_opponent: oScores.c4,
      result_extra_opponent: oScores.extra,
    });
  };

  const handlePlayerPoint = async (playerId: number, points: 1 | 2 | 3) => {
    handleAdjustClubScore(points);
    setRosterStats((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const keyA = `t${points}a` as "t1a" | "t2a" | "t3a";
          const keyI = `t${points}i` as "t1i" | "t2i" | "t3i";
          const updated = {
            ...p,
            [keyA]: (p[keyA] || 0) + 1,
            [keyI]: (p[keyI] || 0) + 1,
          };
          PlayerStatsController.save({
            gameId: currentMatch.id,
            playerId: p.id,
            ...updated,
          });
          return updated;
        }
        return p;
      })
    );
  };

  const handlePlayerFoul = async (playerId: number) => {
    setRosterStats((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const updated = { ...p, falt: (p.falt || 0) + 1 };
          PlayerStatsController.save({
            gameId: currentMatch.id,
            playerId: p.id,
            ...updated,
          });
          return updated;
        }
        return p;
      })
    );
  };

  const handleConfirmFinishMatch = async () => {
    setIsTimerRunning(false);
    await GameController.finishMatch(currentMatch.id, {
      resultC1: clubScores.c1,
      resultC2: clubScores.c2,
      resultC3: clubScores.c3,
      resultC4: clubScores.c4,
      resultExtra: clubScores.extra,
      resultC1Opponent: opponentScores.c1,
      resultC2Opponent: opponentScores.c2,
      resultC3Opponent: opponentScores.c3,
      resultC4Opponent: opponentScores.c4,
      resultExtraOpponent: opponentScores.extra,
    });
    setFinishModalVisible(false);
    onFinishMatch();
  };

  const getStatusBadge = () => {
    if (currentMatch.status === "finished") {
      return (
        <View className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500">
          <Text className="text-xs font-bold text-emerald-400">Finalizado</Text>
        </View>
      );
    }
    if (currentMatch.status === "inProgress") {
      return (
        <View className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500">
          <Text className="text-xs font-bold text-amber-400">En Juego</Text>
        </View>
      );
    }
    return (
      <View className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500">
        <Text className="text-xs font-bold text-blue-400">Pendiente</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 w-full bg-gray-900 px-3 py-2">
      {/* Finish Match Confirmation Modal */}
      <Modal
        visible={finishModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFinishModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-4">
          <View className="w-full bg-danish-dark-gray border-2 border-danish-red rounded-2xl p-5 shadow-2xl">
            <Text className="text-xl font-bold text-danish-white text-center mb-2">
              ¿Finalizar Partido?
            </Text>
            <Text className="text-sm text-gray-300 text-center mb-4">
              El resultado final ({totalClubScore} - {totalOpponentScore}) se guardará y el estado cambiará a Finalizado.
            </Text>
            <View className="flex-col gap-2">
              <Button title="Sí, Guardar y Finalizar" onPress={handleConfirmFinishMatch} />
              <Button
                title="Cancelar"
                className="bg-gray-700"
                onPress={() => setFinishModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Match Header Info */}
      <View className="w-full bg-danish-dark-gray rounded-xl p-3 border border-gray-700 mb-2">
        <View className="flex-row justify-between items-center mb-1">
          <View className="flex-1">
            <Text className="text-xs text-danish-gold font-bold">{currentMatch.round}</Text>
            <Text className="text-lg font-bold text-danish-white">
              vs {currentMatch.opponent}
            </Text>
          </View>
          {getStatusBadge()}
        </View>
        <Text className="text-xs text-gray-400">{currentMatch.date}</Text>
      </View>

      {/* Live Chronograph & Quarter Controls */}
      <View className="w-full bg-gray-950 border-2 border-danish-gold/60 rounded-2xl p-3 items-center mb-2 shadow-lg shadow-gold-500/10">
        {/* Quarter Selector Tabs */}
        <View className="flex-row gap-1.5 mb-2">
          {(["c1", "c2", "c3", "c4", "extra"] as QuarterKey[]).map((q) => (
            <TouchableOpacity
              key={q}
              onPress={() => setActiveQuarter(q)}
              className={`px-3 py-1 rounded-lg border ${
                activeQuarter === q
                  ? "bg-danish-gold border-danish-gold"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeQuarter === q ? "text-gray-950" : "text-gray-300"
                }`}
              >
                {q === "extra" ? "PR" : q.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Digital Clock Display */}
        <Text className="text-5xl font-black text-danish-gold tracking-widest my-1 font-mono">
          {formatTimer(seconds)}
        </Text>

        {/* Chrono Controls */}
        <View className="flex-row items-center gap-4 mt-1">
          <TouchableOpacity
            onPress={handleToggleTimer}
            className={`px-6 py-2.5 rounded-full flex-row items-center gap-2 shadow-lg ${
              isTimerRunning ? "bg-amber-600" : "bg-emerald-600"
            }`}
          >
            <Feather
              name={isTimerRunning ? "pause" : "play"}
              size={18}
              color="white"
            />
            <Text className="text-white font-bold text-sm">
              {isTimerRunning ? "Pausar" : "Iniciar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleResetTimer(600)}
            className="p-2.5 rounded-full bg-gray-800 border border-gray-700"
          >
            <Feather name="rotate-ccw" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scoreboard */}
      <View className="w-full bg-danish-dark-gray border border-danish-red rounded-xl p-3 mb-2 flex-row justify-between items-center">
        {/* Club Side */}
        <View className="flex-1 items-center">
          <Text className="text-xs text-gray-300 font-semibold mb-0.5 truncate">
            {club?.name || "Local"}
          </Text>
          <Text className="text-4xl font-extrabold text-danish-gold">
            {totalClubScore}
          </Text>
          <View className="flex-row gap-1 mt-1">
            <TouchableOpacity
              onPress={() => handleAdjustClubScore(1)}
              className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700"
            >
              <Text className="text-xs text-danish-white font-bold">+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAdjustClubScore(2)}
              className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700"
            >
              <Text className="text-xs text-danish-white font-bold">+2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAdjustClubScore(3)}
              className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700"
            >
              <Text className="text-xs text-danish-white font-bold">+3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAdjustClubScore(-1)}
              className="px-2 py-0.5 rounded bg-red-950 border border-red-800"
            >
              <Text className="text-xs text-red-400 font-bold">-1</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-2xl font-bold text-gray-500 px-2">-</Text>

        {/* Opponent Side */}
        <View className="flex-1 items-center">
          <Text className="text-xs text-gray-300 font-semibold mb-0.5 truncate">
            {currentMatch.opponent}
          </Text>
          <Text className="text-4xl font-extrabold text-danish-white">
            {totalOpponentScore}
          </Text>
          <View className="flex-row gap-1 mt-1">
            <TouchableOpacity
              onPress={() => handleAdjustOpponentScore(1)}
              className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700"
            >
              <Text className="text-xs text-danish-white font-bold">+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAdjustOpponentScore(2)}
              className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700"
            >
              <Text className="text-xs text-danish-white font-bold">+2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAdjustOpponentScore(3)}
              className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700"
            >
              <Text className="text-xs text-danish-white font-bold">+3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAdjustOpponentScore(-1)}
              className="px-2 py-0.5 rounded bg-red-950 border border-red-800"
            >
              <Text className="text-xs text-red-400 font-bold">-1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Roster Live Stats Section */}
      <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
        Anotación Rápida Jugadores
      </Text>
      <ScrollView className="flex-1 max-h-48 mb-2" showsVerticalScrollIndicator={true}>
        {rosterStats.map((p) => {
          const playerPoints = (p.t1a || 0) + (p.t2a || 0) * 2 + (p.t3a || 0) * 3;
          return (
            <View
              key={p.id}
              className="flex-row justify-between items-center p-2.5 my-1 bg-danish-dark-gray rounded-xl border border-gray-800"
            >
              <View className="flex-row items-center gap-2 w-1/3">
                <Text className="text-xs font-extrabold text-danish-gold">
                  #{p.number}
                </Text>
                <Text className="text-xs font-semibold text-danish-white truncate">
                  {p.firstName}
                </Text>
              </View>

              <View className="flex-row items-center gap-1.5">
                <Text className="text-xs font-bold text-gray-300 mr-1">
                  {playerPoints} pts
                </Text>
                <TouchableOpacity
                  onPress={() => handlePlayerPoint(p.id, 1)}
                  className="px-2 py-1 rounded bg-gray-800 border border-gray-700"
                >
                  <Text className="text-xs text-danish-white font-bold">+1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePlayerPoint(p.id, 2)}
                  className="px-2 py-1 rounded bg-gray-800 border border-gray-700"
                >
                  <Text className="text-xs text-danish-white font-bold">+2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePlayerPoint(p.id, 3)}
                  className="px-2 py-1 rounded bg-gray-800 border border-gray-700"
                >
                  <Text className="text-xs text-danish-white font-bold">+3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePlayerFoul(p.id)}
                  className="px-2 py-1 rounded bg-red-950 border border-red-800"
                >
                  <Text className="text-xs text-red-400 font-bold">F ({p.falt || 0})</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Match Actions */}
      <View className="w-full flex-col gap-2 pt-1">
        <Button
          title="Guardar y Finalizar Partido"
          onPress={() => setFinishModalVisible(true)}
        />
        <Button
          title="Volver a la Lista"
          className="bg-gray-700"
          onPress={onReturn}
        />
      </View>
    </View>
  );
};

export default PlayMatch;
