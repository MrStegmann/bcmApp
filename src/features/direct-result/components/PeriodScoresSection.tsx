import React from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from "@expo/vector-icons/Feather";
import { PeriodKey, PeriodScoreInput, PeriodScoresSectionProps } from "../types";

const PERIOD_LABELS: Record<PeriodKey, string> = {
  q1: "1º Cuarto (Q1)",
  q2: "2º Cuarto (Q2)",
  q3: "3º Cuarto (Q3)",
  q4: "4º Cuarto (Q4)",
  extra: "Prórroga (OT)",
};

export const PeriodScoresSection: React.FC<PeriodScoresSectionProps> = ({
  buffer,
  hasExtraTime,
  onToggleExtraTime,
  onUpdatePeriod,
  totalTeamPoints,
  totalRivalPoints,
}) => {
  const activePeriods: PeriodKey[] = hasExtraTime
    ? ["q1", "q2", "q3", "q4", "extra"]
    : ["q1", "q2", "q3", "q4"];

  const renderPeriodCard = (period: PeriodKey) => {
    const periodData: PeriodScoreInput = buffer.periods[period] || {
      teamPoints: 0,
      teamFouls: 0,
      rivalPoints: 0,
      rivalFouls: 0,
    };

    const isExtra = period === "extra";

    return (
      <View
        key={period}
        className={`mb-3 p-3.5 rounded-xl border ${
          isExtra
            ? "bg-amber-950/20 border-amber-500/40"
            : "bg-slate-card border-slate-border"
        }`}
      >
        <View className="flex-row items-center justify-between mb-2.5 pb-1.5 border-b border-slate-border/50">
          <View className="flex-row items-center gap-1.5">
            <Feather
              name={isExtra ? "clock" : "shield"}
              size={14}
              color={isExtra ? "#F59E0B" : "#0EA5E9"}
            />
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              {PERIOD_LABELS[period]}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-primary">
            {periodData.teamPoints} - {periodData.rivalPoints}
          </Text>
        </View>

        <View className="flex-row gap-3">
          {/* Team Column */}
          <View className="flex-1 bg-slate-dark/60 p-2.5 rounded-lg border border-slate-border/40">
            <Text className="text-[11px] font-bold text-primary mb-1.5 text-center">
              Nuestro Equipo
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="text-[10px] text-on-surface-variant mb-0.5">Puntos</Text>
                <TextInput
                  testID={`input-${period}-team-points`}
                  keyboardType="numeric"
                  value={periodData.teamPoints > 0 ? String(periodData.teamPoints) : ""}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  onChangeText={(val) => onUpdatePeriod(period, "teamPoints", val)}
                  className="bg-slate-card text-white text-center font-bold text-sm py-1.5 px-2 rounded-md border border-slate-border focus:border-primary"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] text-on-surface-variant mb-0.5">Faltas</Text>
                <TextInput
                  testID={`input-${period}-team-fouls`}
                  keyboardType="numeric"
                  value={periodData.teamFouls > 0 ? String(periodData.teamFouls) : ""}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  onChangeText={(val) => onUpdatePeriod(period, "teamFouls", val)}
                  className="bg-slate-card text-white text-center font-bold text-sm py-1.5 px-2 rounded-md border border-slate-border focus:border-primary"
                />
              </View>
            </View>
          </View>

          {/* Rival Column */}
          <View className="flex-1 bg-slate-dark/60 p-2.5 rounded-lg border border-slate-border/40">
            <Text className="text-[11px] font-bold text-court-orange mb-1.5 text-center">
              Rival
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className="text-[10px] text-on-surface-variant mb-0.5">Puntos</Text>
                <TextInput
                  testID={`input-${period}-rival-points`}
                  keyboardType="numeric"
                  value={periodData.rivalPoints > 0 ? String(periodData.rivalPoints) : ""}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  onChangeText={(val) => onUpdatePeriod(period, "rivalPoints", val)}
                  className="bg-slate-card text-white text-center font-bold text-sm py-1.5 px-2 rounded-md border border-slate-border focus:border-court-orange"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] text-on-surface-variant mb-0.5">Faltas</Text>
                <TextInput
                  testID={`input-${period}-rival-fouls`}
                  keyboardType="numeric"
                  value={periodData.rivalFouls > 0 ? String(periodData.rivalFouls) : ""}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  onChangeText={(val) => onUpdatePeriod(period, "rivalFouls", val)}
                  className="bg-slate-card text-white text-center font-bold text-sm py-1.5 px-2 rounded-md border border-slate-border focus:border-court-orange"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 w-full px-4"
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, paddingTop: 8 }}
    >
      {/* Live Total Score Header Banner */}
      <View className="mb-4 p-4 rounded-2xl bg-slate-card border border-primary/40 shadow-lg flex-row items-center justify-between">
        <View className="items-center flex-1">
          <Text className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
            Equipo
          </Text>
          <Text className="text-3xl font-extrabold text-white">{totalTeamPoints}</Text>
        </View>

        <View className="px-3 items-center">
          <Text className="text-xs text-on-surface-variant font-bold">TOTAL</Text>
          <Text className="text-lg font-black text-slate-border">VS</Text>
        </View>

        <View className="items-center flex-1">
          <Text className="text-xs font-bold text-court-orange mb-1 uppercase tracking-wider">
            Rival
          </Text>
          <Text className="text-3xl font-extrabold text-white">{totalRivalPoints}</Text>
        </View>
      </View>

      {/* Overtime Toggle Control */}
      <View className="mb-4 p-3 bg-slate-card rounded-xl border border-slate-border flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Feather name="clock" size={16} color={hasExtraTime ? "#F59E0B" : "#94A3B8"} />
          <Text className="text-sm font-semibold text-white">Prórroga / Tiempo Extra</Text>
        </View>
        <Switch
          testID="overtime-toggle"
          value={hasExtraTime}
          onValueChange={onToggleExtraTime}
          thumbColor={hasExtraTime ? "#F59E0B" : "#64748B"}
          trackColor={{ false: "#334155", true: "#B45309" }}
        />
      </View>

      {/* Render Active Periods */}
      {activePeriods.map(renderPeriodCard)}
    </KeyboardAwareScrollView>
  );
};

export default PeriodScoresSection;
