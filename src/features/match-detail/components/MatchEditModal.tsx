import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import {
  MatchEditModalProps,
  MatchEditBuffer,
  PeriodId,
  PlayerRosterItem,
} from "../types";

export const MatchEditModal: React.FC<MatchEditModalProps> = ({
  visible,
  initialMatch,
  initialPlayers,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [activeTab, setActiveTab] = useState<"periods" | "players">("periods");
  const [hasExtraTime, setHasExtraTime] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<MatchEditBuffer>({
    periods: {
      q1: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      q2: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      q3: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      q4: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
    },
    players: {},
  });

  useEffect(() => {
    if (visible && initialMatch) {
      const extraExists =
        Number(initialMatch.resultExtra || 0) > 0 ||
        Number(initialMatch.resultExtraOpponent || 0) > 0 ||
        Number(initialMatch.foulsExtra || 0) > 0 ||
        Number(initialMatch.foulsExtraOpponent || 0) > 0;

      setHasExtraTime(extraExists);

      const initialPeriods: MatchEditBuffer["periods"] = {
        q1: {
          teamPoints: Number(initialMatch.resultC1 || 0),
          teamFouls: Number(initialMatch.foulsC1 || 0),
          rivalPoints: Number(initialMatch.resultC1Opponent || 0),
          rivalFouls: Number(initialMatch.foulsC1Opponent || 0),
        },
        q2: {
          teamPoints: Number(initialMatch.resultC2 || 0),
          teamFouls: Number(initialMatch.foulsC2 || 0),
          rivalPoints: Number(initialMatch.resultC2Opponent || 0),
          rivalFouls: Number(initialMatch.foulsC2Opponent || 0),
        },
        q3: {
          teamPoints: Number(initialMatch.resultC3 || 0),
          teamFouls: Number(initialMatch.foulsC3 || 0),
          rivalPoints: Number(initialMatch.resultC3Opponent || 0),
          rivalFouls: Number(initialMatch.foulsC3Opponent || 0),
        },
        q4: {
          teamPoints: Number(initialMatch.resultC4 || 0),
          teamFouls: Number(initialMatch.foulsC4 || 0),
          rivalPoints: Number(initialMatch.resultC4Opponent || 0),
          rivalFouls: Number(initialMatch.foulsC4Opponent || 0),
        },
        extra: {
          teamPoints: Number(initialMatch.resultExtra || 0),
          teamFouls: Number(initialMatch.foulsExtra || 0),
          rivalPoints: Number(initialMatch.resultExtraOpponent || 0),
          rivalFouls: Number(initialMatch.foulsExtraOpponent || 0),
        },
      };

      const initialPlayersRecord: MatchEditBuffer["players"] = {};
      initialPlayers.forEach((p) => {
        initialPlayersRecord[p.id] = {
          minutes: p.minutes,
          t1a: p.t1a,
          t1i: p.t1i,
          t2a: p.t2a,
          t2i: p.t2i,
          t3a: p.t3a,
          t3i: p.t3i,
          oreb: p.oreb,
          dreb: p.dreb,
          asis: p.asis,
          rec: p.rec,
          per: p.per,
          falt: p.falt,
        };
      });

      setBuffer({
        periods: initialPeriods,
        players: initialPlayersRecord,
      });
      setActiveTab("periods");
    }
  }, [visible, initialMatch, initialPlayers]);

  const updatePeriodField = (
    periodId: PeriodId,
    field: "teamPoints" | "teamFouls" | "rivalPoints" | "rivalFouls",
    textVal: string
  ) => {
    const num = Math.max(0, parseInt(textVal, 10) || 0);
    setBuffer((prev) => ({
      ...prev,
      periods: {
        ...prev.periods,
        [periodId]: {
          ...prev.periods[periodId],
          [field]: num,
        },
      },
    }));
  };

  const updatePlayerField = (
    playerId: number,
    field: keyof MatchEditBuffer["players"][number],
    textVal: string
  ) => {
    const num = Math.max(0, parseInt(textVal, 10) || 0);
    setBuffer((prev) => ({
      ...prev,
      players: {
        ...prev.players,
        [playerId]: {
          ...prev.players[playerId],
          [field]: num,
        },
      },
    }));
  };

  const handleSave = async () => {
    // If extra time is toggled off, reset extra values to 0
    const finalBuffer: MatchEditBuffer = {
      ...buffer,
      periods: {
        ...buffer.periods,
        extra: hasExtraTime
          ? buffer.periods.extra
          : { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      },
    };
    await onSave(finalBuffer);
  };

  const periodKeys: { id: PeriodId; label: string }[] = [
    { id: "q1", label: "Periodo 1" },
    { id: "q2", label: "Periodo 2" },
    { id: "q3", label: "Periodo 3" },
    { id: "q4", label: "Periodo 4" },
  ];
  if (hasExtraTime) {
    periodKeys.push({ id: "extra", label: "Prórroga / Extra" });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/85 justify-end">
        <View className="w-full bg-slate-900 rounded-t-3xl border-t border-slate-700 max-h-[90%] overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-slate-800/90 border-b border-slate-700">
            <View>
              <Text className="text-white font-extrabold text-base">
                Editar Datos del Partido
              </Text>
              <Text className="text-slate-400 text-xs">
                {initialMatch?.opponent
                  ? `vs ${initialMatch.opponent}`
                  : "Modo Edición"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onCancel}
              disabled={isSaving}
              className="p-2 rounded-full bg-slate-700/60 active:bg-slate-700"
              testID="cancel-edit-modal-button"
            >
              <Feather name="x" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <View className="flex-row px-4 py-2.5 bg-slate-850 border-b border-slate-750">
            <TouchableOpacity
              onPress={() => setActiveTab("periods")}
              className={`flex-1 py-2 items-center rounded-xl mr-2 ${
                activeTab === "periods"
                  ? "bg-sky-500/20 border border-sky-500/50"
                  : "bg-slate-800/40 border border-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "periods" ? "text-sky-400" : "text-slate-400"
                }`}
              >
                Marcador y Faltas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("players")}
              className={`flex-1 py-2 items-center rounded-xl ml-2 ${
                activeTab === "players"
                  ? "bg-sky-500/20 border border-sky-500/50"
                  : "bg-slate-800/40 border border-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "players" ? "text-sky-400" : "text-slate-400"
                }`}
              >
                Jugadores ({initialPlayers.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView
            className="p-4"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === "periods" ? (
              <View>
                {/* Extra time toggle */}
                <View className="flex-row items-center justify-between bg-slate-800/70 p-3 rounded-xl border border-slate-700/60 mb-4">
                  <View>
                    <Text className="text-white font-bold text-xs">
                      ¿Hubo Prórroga / Tiempo Extra?
                    </Text>
                    <Text className="text-slate-400 text-[11px]">
                      Habilitar periodo adicional
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setHasExtraTime((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      hasExtraTime
                        ? "bg-amber-500/20 border-amber-500/50"
                        : "bg-slate-700/60 border-slate-600/60"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        hasExtraTime ? "text-amber-400" : "text-slate-300"
                      }`}
                    >
                      {hasExtraTime ? "Activado" : "Desactivado"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Period Cards */}
                {periodKeys.map((pKey) => {
                  const pData = buffer.periods[pKey.id];
                  return (
                    <View
                      key={pKey.id}
                      className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 mb-3"
                    >
                      <Text className="text-sky-400 font-bold text-xs uppercase mb-3">
                        {pKey.label}
                      </Text>

                      <View className="flex-row items-center justify-between mb-2">
                        {/* Team Points */}
                        <View className="flex-1 mr-2">
                          <Text className="text-slate-300 text-[11px] font-medium mb-1">
                            Pts Equipo
                          </Text>
                          <TextInput
                            value={String(pData.teamPoints)}
                            onChangeText={(val) =>
                              updatePeriodField(pKey.id, "teamPoints", val)
                            }
                            keyboardType="numeric"
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-sm text-center"
                          />
                        </View>

                        {/* Team Fouls */}
                        <View className="flex-1 ml-2">
                          <Text className="text-slate-300 text-[11px] font-medium mb-1">
                            Faltas Eq
                          </Text>
                          <TextInput
                            value={String(pData.teamFouls)}
                            onChangeText={(val) =>
                              updatePeriodField(pKey.id, "teamFouls", val)
                            }
                            keyboardType="numeric"
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-bold text-sm text-center"
                          />
                        </View>
                      </View>

                      <View className="flex-row items-center justify-between">
                        {/* Rival Points */}
                        <View className="flex-1 mr-2">
                          <Text className="text-slate-300 text-[11px] font-medium mb-1">
                            Pts Rival
                          </Text>
                          <TextInput
                            value={String(pData.rivalPoints)}
                            onChangeText={(val) =>
                              updatePeriodField(pKey.id, "rivalPoints", val)
                            }
                            keyboardType="numeric"
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-sm text-center"
                          />
                        </View>

                        {/* Rival Fouls */}
                        <View className="flex-1 ml-2">
                          <Text className="text-slate-300 text-[11px] font-medium mb-1">
                            Faltas Riv
                          </Text>
                          <TextInput
                            value={String(pData.rivalFouls)}
                            onChangeText={(val) =>
                              updatePeriodField(pKey.id, "rivalFouls", val)
                            }
                            keyboardType="numeric"
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-rose-400 font-bold text-sm text-center"
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              /* Players Tab */
              <View>
                {initialPlayers.map((player) => {
                  const pStats = buffer.players[player.id] || {
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

                  return (
                    <View
                      key={player.id}
                      className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 mb-4"
                    >
                      {/* Player Banner */}
                      <View className="flex-row items-center justify-between pb-2 mb-2 border-b border-slate-700/50">
                        <View className="flex-row items-center">
                          <View className="w-7 h-7 rounded-full bg-slate-700 items-center justify-center mr-2">
                            <Text className="text-amber-400 font-black text-xs">
                              #{player.jerseyNumber || "0"}
                            </Text>
                          </View>
                          <Text className="text-white font-bold text-sm">
                            {player.fullName || "Jugador"}
                          </Text>
                        </View>

                        {/* Minutes Input */}
                        <View className="flex-row items-center">
                          <Text className="text-slate-400 text-xs mr-2 font-medium">
                            Min:
                          </Text>
                          <TextInput
                            value={String(pStats.minutes)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "minutes", val)
                            }
                            keyboardType="numeric"
                            className="w-12 bg-slate-900 border border-slate-700 rounded-md px-1.5 py-1 text-white font-bold text-xs text-center"
                          />
                        </View>
                      </View>

                      {/* Shooting Row (1pt, 2pt, 3pt makes/attempts) */}
                      <View className="flex-row items-center justify-between mb-2.5">
                        <View className="flex-1 mr-1.5">
                          <Text className="text-slate-400 text-[10px] font-semibold text-center mb-0.5">
                            TL (Anot/Tot)
                          </Text>
                          <View className="flex-row items-center space-x-1">
                            <TextInput
                              value={String(pStats.t1a)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t1a", val)
                              }
                              keyboardType="numeric"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-emerald-400 font-bold text-xs text-center"
                            />
                            <Text className="text-slate-500 font-bold text-xs">
                              /
                            </Text>
                            <TextInput
                              value={String(pStats.t1i)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t1i", val)
                              }
                              keyboardType="numeric"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-slate-300 font-bold text-xs text-center"
                            />
                          </View>
                        </View>

                        <View className="flex-1 mx-1.5">
                          <Text className="text-slate-400 text-[10px] font-semibold text-center mb-0.5">
                            T2 (Anot/Tot)
                          </Text>
                          <View className="flex-row items-center space-x-1">
                            <TextInput
                              value={String(pStats.t2a)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t2a", val)
                              }
                              keyboardType="numeric"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-emerald-400 font-bold text-xs text-center"
                            />
                            <Text className="text-slate-500 font-bold text-xs">
                              /
                            </Text>
                            <TextInput
                              value={String(pStats.t2i)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t2i", val)
                              }
                              keyboardType="numeric"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-slate-300 font-bold text-xs text-center"
                            />
                          </View>
                        </View>

                        <View className="flex-1 ml-1.5">
                          <Text className="text-slate-400 text-[10px] font-semibold text-center mb-0.5">
                            T3 (Anot/Tot)
                          </Text>
                          <View className="flex-row items-center space-x-1">
                            <TextInput
                              value={String(pStats.t3a)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t3a", val)
                              }
                              keyboardType="numeric"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-emerald-400 font-bold text-xs text-center"
                            />
                            <Text className="text-slate-500 font-bold text-xs">
                              /
                            </Text>
                            <TextInput
                              value={String(pStats.t3i)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t3i", val)
                              }
                              keyboardType="numeric"
                              className="flex-1 bg-slate-900 border border-slate-700 rounded px-1 py-1 text-slate-300 font-bold text-xs text-center"
                            />
                          </View>
                        </View>
                      </View>

                      {/* Rebounds, Assists, Steals, Turnovers, Fouls Row */}
                      <View className="flex-row items-center justify-between">
                        <View className="items-center flex-1 mr-1">
                          <Text className="text-slate-400 text-[10px] mb-0.5">
                            ORB
                          </Text>
                          <TextInput
                            value={String(pStats.oreb)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "oreb", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-slate-400 text-[10px] mb-0.5">
                            DRB
                          </Text>
                          <TextInput
                            value={String(pStats.dreb)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "dreb", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-slate-400 text-[10px] mb-0.5">
                            AST
                          </Text>
                          <TextInput
                            value={String(pStats.asis)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "asis", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-slate-400 text-[10px] mb-0.5">
                            REC
                          </Text>
                          <TextInput
                            value={String(pStats.rec)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "rec", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-slate-400 text-[10px] mb-0.5">
                            PER
                          </Text>
                          <TextInput
                            value={String(pStats.per)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "per", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-rose-300 text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 ml-1">
                          <Text className="text-slate-400 text-[10px] mb-0.5">
                            FALT
                          </Text>
                          <TextInput
                            value={String(pStats.falt)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "falt", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-amber-300 text-xs text-center"
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View className="flex-row items-center justify-between p-4 bg-slate-800/90 border-t border-slate-700">
            <TouchableOpacity
              onPress={onCancel}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-slate-700 active:bg-slate-600"
            >
              <Text className="text-slate-300 font-bold text-sm">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className="flex-row items-center px-6 py-2.5 rounded-xl bg-sky-500 active:bg-sky-600 shadow-md shadow-sky-500/30"
              testID="save-match-edits-button"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Feather name="check" size={16} color="#ffffff" />
                  <Text className="text-white font-extrabold text-sm ml-1.5">
                    Guardar Cambios
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
