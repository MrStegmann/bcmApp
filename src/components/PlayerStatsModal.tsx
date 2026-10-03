import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PlayerStatsModalProps, StatActionType } from "../types/match";
import { calculatePlayerPoints } from "../store/GameStore";

type ModalStep = "main" | "shotMakeMiss" | "assistSelector";

export const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({
  visible,
  player,
  onClose,
  onRecordStat,
  courtTeammates,
}) => {
  const [step, setStep] = useState<ModalStep>("main");
  const [pendingShot, setPendingShot] = useState<"t1" | "t2" | "t3" | null>(null);

  if (!player) return null;

  const handleClose = () => {
    setStep("main");
    setPendingShot(null);
    onClose();
  };

  const handleSelectStat = (statType: StatActionType) => {
    if (statType === "t1" || statType === "t2" || statType === "t3") {
      setPendingShot(statType);
      setStep("shotMakeMiss");
    } else {
      onRecordStat(player.id, statType);
      handleClose();
    }
  };

  const handleShotMakeMiss = (scored: boolean) => {
    if (!pendingShot) return;

    if (!scored) {
      // Missed shot
      onRecordStat(player.id, pendingShot, false);
      handleClose();
      return;
    }

    // Scored shot: If t1, log directly. If t2 or t3, prompt assist.
    if (pendingShot === "t1") {
      onRecordStat(player.id, "t1", true);
      handleClose();
    } else {
      setStep("assistSelector");
    }
  };

  const handleSelectAssist = (assistingPlayerId: number | null) => {
    if (!pendingShot) return;
    onRecordStat(player.id, pendingShot, true, assistingPlayerId);
    handleClose();
  };

  const currentPts = calculatePlayerPoints(player);

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/80 px-4 py-8">
        <View className="w-full max-h-[90%] bg-danish-dark-gray border-2 border-danish-gold rounded-3xl p-5 shadow-2xl flex-col justify-between">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-700 pb-3 mb-3">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-danish-gold items-center justify-center border border-amber-300">
                <Text className="text-base font-black text-gray-950">{player.number}</Text>
              </View>
              <View>
                <Text className="text-lg font-black text-danish-white">
                  {player.firstName} {player.lastName}
                </Text>
                <View className="flex-row items-center gap-3 mt-0.5">
                  <Text className="text-xs font-bold text-danish-gold">{currentPts} pts</Text>
                  <Text className="text-xs text-gray-500">•</Text>
                  <Text className="text-xs font-bold text-red-400">{player.falt} faltas</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} className="p-2 rounded-full bg-gray-800">
              <Feather name="x" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Step 1: Main Stats Selection */}
          {step === "main" && (
            <View className="flex-col gap-3 my-2">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Anotación & Tiros
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleSelectStat("t1")}
                  className="flex-1 py-3 bg-gray-800 active:bg-amber-950 border border-gray-700 active:border-danish-gold rounded-2xl items-center"
                >
                  <Text className="text-lg font-black text-danish-white">T1</Text>
                  <Text className="text-[10px] text-gray-400 font-semibold mt-0.5">Tiro Libre</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("t2")}
                  className="flex-1 py-3 bg-gray-800 active:bg-amber-950 border border-gray-700 active:border-danish-gold rounded-2xl items-center"
                >
                  <Text className="text-lg font-black text-danish-white">T2</Text>
                  <Text className="text-[10px] text-gray-400 font-semibold mt-0.5">Canasta 2PT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("t3")}
                  className="flex-1 py-3 bg-gray-800 active:bg-amber-950 border border-gray-700 active:border-danish-gold rounded-2xl items-center"
                >
                  <Text className="text-lg font-black text-danish-white">T3</Text>
                  <Text className="text-[10px] text-gray-400 font-semibold mt-0.5">Triple 3PT</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
                Acciones de Juego
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => handleSelectStat("fault")}
                  className="flex-1 min-w-[45%] py-2.5 px-3 bg-red-950/60 border border-red-800 rounded-xl flex-row items-center gap-2"
                >
                  <Ionicons name="warning-outline" size={16} color="#F87171" />
                  <Text className="text-xs font-bold text-red-300">Falta Personal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("asis")}
                  className="flex-1 min-w-[45%] py-2.5 px-3 bg-emerald-950/60 border border-emerald-800 rounded-xl flex-row items-center gap-2"
                >
                  <Feather name="award" size={16} color="#34D399" />
                  <Text className="text-xs font-bold text-emerald-300">Asistencia</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("oreb")}
                  className="flex-1 min-w-[45%] py-2.5 px-3 bg-blue-950/60 border border-blue-800 rounded-xl flex-row items-center gap-2"
                >
                  <Feather name="arrow-up-circle" size={16} color="#60A5FA" />
                  <Text className="text-xs font-bold text-blue-300">Reb. Ofensivo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("dreb")}
                  className="flex-1 min-w-[45%] py-2.5 px-3 bg-indigo-950/60 border border-indigo-800 rounded-xl flex-row items-center gap-2"
                >
                  <Feather name="shield" size={16} color="#818CF8" />
                  <Text className="text-xs font-bold text-indigo-300">Reb. Defensivo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("rec")}
                  className="flex-1 min-w-[45%] py-2.5 px-3 bg-amber-950/60 border border-amber-800 rounded-xl flex-row items-center gap-2"
                >
                  <Feather name="zap" size={16} color="#FBBF24" />
                  <Text className="text-xs font-bold text-amber-300">Recuperación</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectStat("per")}
                  className="flex-1 min-w-[45%] py-2.5 px-3 bg-gray-800 border border-gray-700 rounded-xl flex-row items-center gap-2"
                >
                  <Feather name="alert-triangle" size={16} color="#9CA3AF" />
                  <Text className="text-xs font-bold text-gray-300">Pérdida</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 2: Make vs Miss Prompt */}
          {step === "shotMakeMiss" && (
            <View className="py-4 items-center">
              <Text className="text-base font-bold text-danish-white mb-1">
                ¿Resultado del {pendingShot?.toUpperCase()}?
              </Text>
              <Text className="text-xs text-gray-400 mb-6 text-center">
                Confirma si el tiro fue anotado o fallado por {player.firstName}.
              </Text>

              <View className="flex-row gap-3 w-full">
                <TouchableOpacity
                  onPress={() => handleShotMakeMiss(true)}
                  className="flex-1 py-4 bg-emerald-600 active:bg-emerald-700 rounded-2xl items-center justify-center shadow-lg"
                >
                  <Feather name="check-circle" size={24} color="white" />
                  <Text className="text-sm font-black text-white uppercase mt-1">Anotado</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleShotMakeMiss(false)}
                  className="flex-1 py-4 bg-red-700 active:bg-red-800 rounded-2xl items-center justify-center shadow-lg"
                >
                  <Feather name="x-circle" size={24} color="white" />
                  <Text className="text-sm font-black text-white uppercase mt-1">Fallado</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 3: Assist Selection */}
          {step === "assistSelector" && (
            <View className="py-2">
              <Text className="text-base font-bold text-danish-white mb-1 text-center">
                ¿Quién ha dado la asistencia?
              </Text>
              <Text className="text-xs text-gray-400 mb-4 text-center">
                Selecciona al compañero en pista o indica si no hubo asistencia.
              </Text>

              <ScrollView className="max-h-48 my-1" showsVerticalScrollIndicator={true}>
                <View className="flex-col gap-2">
                  {courtTeammates
                    .filter((t) => t.id !== player.id)
                    .map((teammate) => (
                      <TouchableOpacity
                        key={teammate.id}
                        onPress={() => handleSelectAssist(teammate.id)}
                        className="p-3 bg-gray-800 active:bg-amber-950 border border-gray-700 active:border-danish-gold rounded-xl flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center gap-3">
                          <View className="w-7 h-7 rounded-full bg-danish-gold items-center justify-center">
                            <Text className="text-xs font-black text-gray-950">
                              {teammate.number}
                            </Text>
                          </View>
                          <Text className="text-sm font-bold text-danish-white">
                            {teammate.firstName} {teammate.lastName}
                          </Text>
                        </View>
                        <Feather name="chevron-right" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => handleSelectAssist(null)}
                className="w-full py-3 mt-3 bg-gray-700 active:bg-gray-600 rounded-xl items-center"
              >
                <Text className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Sin Asistencia
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer Back Button if in sub-step */}
          {step !== "main" && (
            <TouchableOpacity
              onPress={() => setStep("main")}
              className="mt-2 py-2 items-center"
            >
              <Text className="text-xs text-gray-400 font-semibold">← Volver a opciones</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PlayerStatsModal;
