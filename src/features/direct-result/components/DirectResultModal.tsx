import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import {
  DirectResultModalProps,
  DirectResultBuffer,
  PeriodKey,
  PeriodScoreInput,
  PlayerStatInput,
} from "../types";
import {
  buildInitialDirectResultBuffer,
  calculatePeriodTotals,
  sanitizePositiveInteger,
  validateDirectResult,
} from "../utils/directResultCalculations";
import PeriodScoresSection from "./PeriodScoresSection";
import PlayerStatsSection from "./PlayerStatsSection";

type ActiveTab = "periods" | "players";

export const DirectResultModal: React.FC<DirectResultModalProps> = ({
  visible,
  match,
  availablePlayers,
  onSave,
  onClose,
  isSaving = false,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("periods");
  const [buffer, setBuffer] = useState<DirectResultBuffer>(() =>
    buildInitialDirectResultBuffer(availablePlayers, match)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reinitialize buffer when modal opens with a new match or player list
  useEffect(() => {
    if (visible && match) {
      setBuffer(buildInitialDirectResultBuffer(availablePlayers, match));
      setActiveTab("periods");
      setErrorMessage(null);
    }
  }, [visible, match?.id]);

  const totals = useMemo(() => {
    return calculatePeriodTotals(buffer.periods, buffer.hasExtraTime);
  }, [buffer.periods, buffer.hasExtraTime]);

  const handleToggleExtraTime = (enabled: boolean) => {
    setBuffer((prev) => ({
      ...prev,
      hasExtraTime: enabled,
    }));
  };

  const handleUpdatePeriod = (
    period: PeriodKey,
    field: keyof PeriodScoreInput,
    value: string
  ) => {
    const num = sanitizePositiveInteger(value);
    setBuffer((prev) => ({
      ...prev,
      periods: {
        ...prev.periods,
        [period]: {
          ...prev.periods[period],
          [field]: num,
        },
      },
    }));
    setErrorMessage(null);
  };

  const handleUpdatePlayerStat = (
    playerId: number,
    field: keyof Omit<PlayerStatInput, "playerId" | "statId">,
    value: string
  ) => {
    const num = sanitizePositiveInteger(value);
    setBuffer((prev) => {
      const currentStat = prev.players[playerId] || {
        playerId,
        minutes: 0,
        t1a: 0,
        t1i: 0,
        t2a: 0,
        t2i: 0,
        t3a: 0,
        t3i: 0,
        oreb: 0,
        dreb: 0,
        asis: 0,
        rec: 0,
        per: 0,
        falt: 0,
      };

      const updated = {
        ...currentStat,
        [field]: num,
      };

      // Auto-adjust attempts if user enters made > attempts
      if (field === "t1a" && num > updated.t1i) {
        updated.t1i = num;
      }
      if (field === "t2a" && num > updated.t2i) {
        updated.t2i = num;
      }
      if (field === "t3a" && num > updated.t3i) {
        updated.t3i = num;
      }

      return {
        ...prev,
        players: {
          ...prev.players,
          [playerId]: updated,
        },
      };
    });
    setErrorMessage(null);
  };

  const handleSavePress = async () => {
    if (!match) return;

    const validation = validateDirectResult(buffer);
    if (!validation.isValid) {
      setErrorMessage(validation.errors[0] || "Por favor, revisa los datos introducidos.");
      return;
    }

    setErrorMessage(null);
    try {
      await onSave(match.id, buffer);
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al guardar el resultado del partido.");
    }
  };

  if (!match) return null;

  const roundDisplay =
    typeof match.round === "string" && match.round.toLowerCase().startsWith("jornada")
      ? match.round
      : `Jornada ${match.round || "1"}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-surface">
        {/* Header Bar */}
        <View className="px-4 py-3 flex-row items-center justify-between border-b border-slate-border bg-slate-card">
          <View className="flex-1 pr-2">
            <Text className="text-base font-bold text-white">Resultado Directo</Text>
            <Text className="text-xs text-on-surface-variant truncate">
              {roundDisplay} • vs {match.opponent}
            </Text>
          </View>
          <TouchableOpacity
            testID="close-direct-result-modal"
            onPress={onClose}
            disabled={isSaving}
            className="w-9 h-9 rounded-full bg-slate-dark items-center justify-center border border-slate-border active:bg-slate-border"
          >
            <Feather name="x" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Tab Switching Navigation */}
        <View className="flex-row px-4 pt-3 pb-2 gap-2 bg-surface border-b border-slate-border/50">
          <TouchableOpacity
            testID="tab-periods"
            onPress={() => setActiveTab("periods")}
            className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-2 border ${
              activeTab === "periods"
                ? "bg-primary/20 border-primary"
                : "bg-slate-card border-slate-border/80"
            }`}
          >
            <Feather
              name="grid"
              size={15}
              color={activeTab === "periods" ? "#0EA5E9" : "#64748B"}
            />
            <Text
              className={`text-xs font-bold ${
                activeTab === "periods" ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              Cuartos y Marcador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-players"
            onPress={() => setActiveTab("players")}
            className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-2 border ${
              activeTab === "players"
                ? "bg-primary/20 border-primary"
                : "bg-slate-card border-slate-border/80"
            }`}
          >
            <Feather
              name="users"
              size={15}
              color={activeTab === "players" ? "#0EA5E9" : "#64748B"}
            />
            <Text
              className={`text-xs font-bold ${
                activeTab === "players" ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              Estadísticas ({availablePlayers.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="flex-1">
          {activeTab === "periods" ? (
            <PeriodScoresSection
              buffer={buffer}
              hasExtraTime={buffer.hasExtraTime}
              onToggleExtraTime={handleToggleExtraTime}
              onUpdatePeriod={handleUpdatePeriod}
              totalTeamPoints={totals.totalTeamPoints}
              totalRivalPoints={totals.totalRivalPoints}
            />
          ) : (
            <PlayerStatsSection
              players={availablePlayers}
              playerStats={buffer.players}
              onUpdateStat={handleUpdatePlayerStat}
            />
          )}
        </View>

        {/* Validation Error Banner */}
        {errorMessage && (
          <View className="mx-4 mb-2 p-2.5 bg-red-950/60 border border-red-500/50 rounded-lg flex-row items-center gap-2">
            <Feather name="alert-triangle" size={14} color="#EF4444" />
            <Text className="text-xs text-red-200 flex-1">{errorMessage}</Text>
          </View>
        )}

        {/* Bottom Actions Bar */}
        <View className="p-4 border-t border-slate-border bg-slate-card flex-row gap-3">
          <TouchableOpacity
            testID="cancel-direct-result-button"
            onPress={onClose}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl bg-slate-dark border border-slate-border items-center justify-center active:bg-slate-border"
          >
            <Text className="text-xs font-bold text-white">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="save-direct-result-button"
            onPress={handleSavePress}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl bg-court-orange items-center justify-center flex-row gap-2 active:opacity-90 shadow-md shadow-court-orange/30"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Feather name="check" size={16} color="#FFFFFF" />
                <Text className="text-xs font-black text-white uppercase tracking-wider">
                  Guardar y Finalizar
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DirectResultModal;
