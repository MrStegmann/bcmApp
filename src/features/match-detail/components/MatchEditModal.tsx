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
          seconds: p.seconds ?? 0,
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
    let num = Math.max(0, parseInt(textVal, 10) || 0);
    if (field === "seconds") {
      num = Math.min(59, num);
    }
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
        <View className="w-full bg-surface-container rounded-t-3xl border-t border-slate-border max-h-[90%] overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-slate-card border-b border-slate-border">
            <View>
              <Text className="text-white font-extrabold text-base">
                Editar Datos del Partido
              </Text>
              <Text className="text-on-surface-variant text-xs">
                {initialMatch?.opponent
                  ? `vs ${initialMatch.opponent}`
                  : "Modo Edición"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onCancel}
              disabled={isSaving}
              className="p-2 min-w-[40px] min-h-[40px] items-center justify-center rounded-full bg-slate-dark active:bg-slate-card"
              testID="cancel-edit-modal-button"
            >
              <Feather name="x" size={18} color="#A78B7D" />
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <View className="flex-row px-4 py-2.5 bg-slate-dark border-b border-slate-border">
            <TouchableOpacity
              onPress={() => setActiveTab("periods")}
              className={`flex-1 py-2.5 items-center rounded-xl mr-2 min-h-[44px] justify-center ${
                activeTab === "periods"
                  ? "bg-court-orange/20 border border-court-orange/60"
                  : "bg-slate-card border border-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "periods" ? "text-court-orange" : "text-on-surface-variant"
                }`}
              >
                Marcador y Faltas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("players")}
              className={`flex-1 py-2.5 items-center rounded-xl ml-2 min-h-[44px] justify-center ${
                activeTab === "players"
                  ? "bg-court-orange/20 border border-court-orange/60"
                  : "bg-slate-card border border-transparent"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activeTab === "players" ? "text-court-orange" : "text-on-surface-variant"
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
                <View className="flex-row items-center justify-between bg-slate-card p-3 rounded-xl border border-slate-border mb-4">
                  <View>
                    <Text className="text-white font-bold text-xs">
                      ¿Hubo Prórroga / Tiempo Extra?
                    </Text>
                    <Text className="text-on-surface-variant text-[11px]">
                      Habilitar periodo adicional
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setHasExtraTime((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-lg border min-h-[40px] items-center justify-center ${
                      hasExtraTime
                        ? "bg-court-orange/20 border-court-orange/60"
                        : "bg-slate-dark border-slate-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        hasExtraTime ? "text-court-orange" : "text-on-surface-variant"
                      }`}
                    >
                      {hasExtraTime ? "Habilitado" : "Deshabilitado"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {periodKeys.map((p) => {
                  const pData = buffer.periods[p.id];
                  return (
                    <View
                      key={p.id}
                      className="bg-slate-card p-3.5 rounded-xl border border-slate-border mb-3"
                    >
                      <Text className="text-white font-bold text-xs uppercase mb-2">
                        {p.label}
                      </Text>

                      <View className="flex-row items-center justify-between">
                        {/* Team points and fouls */}
                        <View className="flex-1 mr-2 bg-slate-dark p-2 rounded-lg border border-slate-border">
                          <Text className="text-court-orange font-bold text-[10px] uppercase mb-1">
                            Nuestro Equipo
                          </Text>
                          <View className="flex-row items-center justify-between gap-2">
                            <View className="flex-1">
                              <Text className="text-on-surface-variant text-[10px] mb-0.5">
                                Puntos
                              </Text>
                              <TextInput
                                value={String(pData.teamPoints)}
                                onChangeText={(val) =>
                                  updatePeriodField(p.id, "teamPoints", val)
                                }
                                keyboardType="numeric"
                                className="w-full bg-slate-card border border-slate-border rounded px-2 py-1 text-white text-xs text-center min-h-[36px]"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-on-surface-variant text-[10px] mb-0.5">
                                Faltas
                              </Text>
                              <TextInput
                                value={String(pData.teamFouls)}
                                onChangeText={(val) =>
                                  updatePeriodField(p.id, "teamFouls", val)
                                }
                                keyboardType="numeric"
                                className="w-full bg-slate-card border border-slate-border rounded px-2 py-1 text-primary text-xs text-center min-h-[36px]"
                              />
                            </View>
                          </View>
                        </View>

                        {/* Rival points and fouls */}
                        <View className="flex-1 ml-2 bg-slate-dark p-2 rounded-lg border border-slate-border">
                          <Text className="text-tactical-blue-light font-bold text-[10px] uppercase mb-1">
                            Rival
                          </Text>
                          <View className="flex-row items-center justify-between gap-2">
                            <View className="flex-1">
                              <Text className="text-on-surface-variant text-[10px] mb-0.5">
                                Puntos
                              </Text>
                              <TextInput
                                value={String(pData.rivalPoints)}
                                onChangeText={(val) =>
                                  updatePeriodField(p.id, "rivalPoints", val)
                                }
                                keyboardType="numeric"
                                className="w-full bg-slate-card border border-slate-border rounded px-2 py-1 text-white text-xs text-center min-h-[36px]"
                              />
                            </View>
                            <View className="flex-1">
                              <Text className="text-on-surface-variant text-[10px] mb-0.5">
                                Faltas
                              </Text>
                              <TextInput
                                value={String(pData.rivalFouls)}
                                onChangeText={(val) =>
                                  updatePeriodField(p.id, "rivalFouls", val)
                                }
                                keyboardType="numeric"
                                className="w-full bg-slate-card border border-slate-border rounded px-2 py-1 text-secondary text-xs text-center min-h-[36px]"
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
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
                      className="bg-slate-card p-3 rounded-xl border border-slate-border mb-3"
                    >
                      {/* Player Row Header */}
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View className="w-6 h-6 rounded-full bg-slate-dark border border-slate-border items-center justify-center mr-2">
                            <Text className="text-white font-bold text-[10px]">
                              #{player.jerseyNumber || "0"}
                            </Text>
                          </View>
                          <Text className="text-white font-bold text-xs">
                            {player.fullName || "Jugador"}
                          </Text>
                        </View>

                        <View className="flex-row items-center gap-1">
                          <Text className="text-on-surface-variant text-[11px]">
                            Min:
                          </Text>
                          <TextInput
                            value={String(pStats.minutes || 0)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "minutes", val)
                            }
                            keyboardType="numeric"
                            className="bg-slate-dark border border-slate-border rounded px-1.5 py-0.5 text-white text-xs w-10 text-center"
                          />
                          <Text className="text-on-surface-variant text-[11px] ml-1">
                            Seg:
                          </Text>
                          <TextInput
                            value={String(pStats.seconds || 0)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "seconds", val)
                            }
                            keyboardType="numeric"
                            className="bg-slate-dark border border-slate-border rounded px-1.5 py-0.5 text-white text-xs w-10 text-center"
                          />
                        </View>
                      </View>

                      {/* Stat Grid Row 1 (Shooting) */}
                      <View className="flex-row items-center justify-between bg-slate-dark p-2 rounded-lg border border-slate-border mb-1.5">
                        <View className="items-center flex-1 mr-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            T1 A/I
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <TextInput
                              value={String(pStats.t1a)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t1a", val)
                              }
                              keyboardType="numeric"
                              className="bg-slate-card border border-slate-border rounded px-1 py-1 text-court-orange text-xs w-8 text-center"
                            />
                            <Text className="text-on-surface-variant text-xs">/</Text>
                            <TextInput
                              value={String(pStats.t1i)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t1i", val)
                              }
                              keyboardType="numeric"
                              className="bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs w-8 text-center"
                            />
                          </View>
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            T2 A/I
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <TextInput
                              value={String(pStats.t2a)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t2a", val)
                              }
                              keyboardType="numeric"
                              className="bg-slate-card border border-slate-border rounded px-1 py-1 text-court-orange text-xs w-8 text-center"
                            />
                            <Text className="text-on-surface-variant text-xs">/</Text>
                            <TextInput
                              value={String(pStats.t2i)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t2i", val)
                              }
                              keyboardType="numeric"
                              className="bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs w-8 text-center"
                            />
                          </View>
                        </View>

                        <View className="items-center flex-1 ml-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            T3 A/I
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <TextInput
                              value={String(pStats.t3a)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t3a", val)
                              }
                              keyboardType="numeric"
                              className="bg-slate-card border border-slate-border rounded px-1 py-1 text-court-orange text-xs w-8 text-center"
                            />
                            <Text className="text-on-surface-variant text-xs">/</Text>
                            <TextInput
                              value={String(pStats.t3i)}
                              onChangeText={(val) =>
                                updatePlayerField(player.id, "t3i", val)
                              }
                              keyboardType="numeric"
                              className="bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs w-8 text-center"
                            />
                          </View>
                        </View>
                      </View>

                      {/* Stat Grid Row 2 (Other Counting Stats) */}
                      <View className="flex-row items-center justify-between bg-slate-dark p-2 rounded-lg border border-slate-border">
                        <View className="items-center flex-1 mr-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            ORB
                          </Text>
                          <TextInput
                            value={String(pStats.oreb)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "oreb", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            DRB
                          </Text>
                          <TextInput
                            value={String(pStats.dreb)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "dreb", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            AST
                          </Text>
                          <TextInput
                            value={String(pStats.asis)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "asis", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            REC
                          </Text>
                          <TextInput
                            value={String(pStats.rec)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "rec", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-card border border-slate-border rounded px-1 py-1 text-white text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 mx-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            PER
                          </Text>
                          <TextInput
                            value={String(pStats.per)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "per", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-card border border-slate-border rounded px-1 py-1 text-court-red text-xs text-center"
                          />
                        </View>

                        <View className="items-center flex-1 ml-1">
                          <Text className="text-on-surface-variant text-[10px] mb-0.5">
                            FALT
                          </Text>
                          <TextInput
                            value={String(pStats.falt)}
                            onChangeText={(val) =>
                              updatePlayerField(player.id, "falt", val)
                            }
                            keyboardType="numeric"
                            className="w-full bg-slate-card border border-slate-border rounded px-1 py-1 text-primary text-xs text-center"
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
          <View className="flex-row items-center justify-between p-4 bg-slate-card border-t border-slate-border">
            <TouchableOpacity
              onPress={onCancel}
              disabled={isSaving}
              className="px-5 py-3 min-h-[48px] rounded-xl bg-slate-dark border border-slate-border active:bg-slate-card justify-center items-center"
            >
              <Text className="text-on-surface font-bold text-sm">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className="flex-row items-center px-6 py-3 min-h-[48px] rounded-xl bg-court-orange active:bg-court-orange-dark shadow-md justify-center"
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

export default MatchEditModal;
