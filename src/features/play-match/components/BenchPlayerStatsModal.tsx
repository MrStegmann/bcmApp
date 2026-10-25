import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { BenchPlayerStatsModalProps } from "../types";
import { formatThrowStat } from "../utils/formatThrowStat";
import { formatPlayerIdentifier } from "../utils/formatPlayerIdentifier";

export const BenchPlayerStatsModal: React.FC<BenchPlayerStatsModalProps> = ({
  visible,
  player,
  onClose,
}) => {
  if (!player) return null;

  const identifier = formatPlayerIdentifier(player);
  const minutes = Math.floor((player.secondsPlayed || 0) / 60);
  const points =
    Number(player.t1a || 0) * 1 +
    Number(player.t2a || 0) * 2 +
    Number(player.t3a || 0) * 3;

  const t1Formatted = formatThrowStat(player.t1a, player.t1i);
  const t2Formatted = formatThrowStat(player.t2a, player.t2i);
  const t3Formatted = formatThrowStat(player.t3a, player.t3i);

  const totalRebounds = Number(player.oreb || 0) + Number(player.dreb || 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      testID="bench-player-stats-modal"
      onRequestClose={onClose}
    >
      {/* Dimmed Backdrop Overlay (Click-outside dismissal) */}
      <Pressable
        testID="bench-stats-backdrop"
        onPress={onClose}
        className="flex-1 bg-black/80 bg-slate-950/80 justify-center items-center p-4"
      >
        {/* Centered Modal Card Container (Consumes touch inside to prevent dismissal) */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl"
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <View className="flex-row items-center space-x-3">
              <View className="w-12 h-12 rounded-full bg-amber-500 items-center justify-center shadow-md">
                <Text className="text-slate-950 font-black text-xl">
                  {player.number ? (String(player.number).startsWith("#") ? player.number : `#${player.number}`) : "#-"}
                </Text>
              </View>
              <View>
                <Text className="text-white font-black text-lg leading-tight" numberOfLines={1}>
                  {identifier}
                </Text>
                <Text className="text-slate-400 text-xs font-semibold">
                  {player.position || "Banquillo"}
                </Text>
              </View>
            </View>

            {/* Cross Button Dismissal */}
            <TouchableOpacity
              testID="bench-stats-close-button"
              onPress={onClose}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 items-center justify-center"
            >
              <Text className="text-slate-400 font-bold text-base leading-none">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Prominent Header Pills: Minutes & Points */}
            <View className="flex-row space-x-3 mb-4">
              <View className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 items-center justify-center shadow-sm">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Tiempo Jugado
                </Text>
                <Text className="text-emerald-400 font-black text-2xl font-mono">
                  {minutes} <Text className="text-emerald-500 text-sm font-bold">min</Text>
                </Text>
              </View>

              <View className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 items-center justify-center shadow-sm">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Puntos
                </Text>
                <Text className="text-amber-400 font-black text-2xl font-mono">
                  {points} <Text className="text-amber-500 text-sm font-bold">pts</Text>
                </Text>
              </View>
            </View>

            {/* Section 1: Shooting Breakdown (T1, T2, T3) */}
            <View className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3">
              <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                Tiros de Campo y Libres
              </Text>
              <View className="space-y-1.5">
                <View className="flex-row items-center justify-between py-1 border-b border-slate-800/60">
                  <Text className="text-slate-300 text-xs font-semibold">Tiros Libres (T1)</Text>
                  <Text className="text-white font-mono font-bold text-xs">{t1Formatted}</Text>
                </View>
                <View className="flex-row items-center justify-between py-1 border-b border-slate-800/60">
                  <Text className="text-slate-300 text-xs font-semibold">Tiros de 2 (T2)</Text>
                  <Text className="text-white font-mono font-bold text-xs">{t2Formatted}</Text>
                </View>
                <View className="flex-row items-center justify-between py-1">
                  <Text className="text-slate-300 text-xs font-semibold">Triples (T3)</Text>
                  <Text className="text-white font-mono font-bold text-xs">{t3Formatted}</Text>
                </View>
              </View>
            </View>

            {/* Section 2: Rebounds */}
            <View className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  Rebotes
                </Text>
                <Text className="text-cyan-400 font-mono font-bold text-xs">
                  Total: {totalRebounds}
                </Text>
              </View>
              <View className="flex-row justify-around py-1">
                <View className="items-center">
                  <Text className="text-slate-400 text-[10px] font-semibold">Ofensivos</Text>
                  <Text className="text-white font-mono font-bold text-sm">{player.oreb || 0}</Text>
                </View>
                <View className="w-px bg-slate-800 h-6 self-center" />
                <View className="items-center">
                  <Text className="text-slate-400 text-[10px] font-semibold">Defensivos</Text>
                  <Text className="text-white font-mono font-bold text-sm">{player.dreb || 0}</Text>
                </View>
              </View>
            </View>

            {/* Section 3: Playmaking & Defense */}
            <View className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3">
              <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                Juego y Defensa
              </Text>
              <View className="flex-row justify-between py-1">
                <View className="items-center flex-1">
                  <Text className="text-slate-400 text-[10px] font-semibold">Asist.</Text>
                  <Text className="text-white font-mono font-bold text-sm">{player.asis || 0}</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-slate-400 text-[10px] font-semibold">Robos</Text>
                  <Text className="text-white font-mono font-bold text-sm">{player.rec || 0}</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-slate-400 text-[10px] font-semibold">Pérdidas</Text>
                  <Text className="text-white font-mono font-bold text-sm">{player.per || 0}</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-slate-400 text-[10px] font-semibold">Faltas</Text>
                  <Text className="text-rose-400 font-mono font-bold text-sm">{player.falt || 0}</Text>
                </View>
              </View>
            </View>

            {/* Section 4: Valuation Badge */}
            <View className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3 flex-row items-center justify-between">
              <Text className="text-amber-300 text-xs font-bold uppercase tracking-wider">
                Valoración
              </Text>
              <Text className="text-amber-400 font-mono font-black text-xl">
                {player.valuation || 0}
              </Text>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default BenchPlayerStatsModal;
