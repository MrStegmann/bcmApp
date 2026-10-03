import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { PeriodKey, PeriodSelectModalProps } from "../types";

const PERIOD_LIST: { key: PeriodKey; label: string; desc: string }[] = [
  { key: "q1", label: "Q1", desc: "Primer Cuarto (10:00)" },
  { key: "q2", label: "Q2", desc: "Segundo Cuarto (10:00)" },
  { key: "q3", label: "Q3", desc: "Tercer Cuarto (10:00)" },
  { key: "q4", label: "Q4", desc: "Cuarto Cuarto (10:00)" },
  { key: "extra", label: "EXTRA", desc: "Tiempo Extra / Prórroga (05:00)" },
];

export const PeriodSelectModal: React.FC<PeriodSelectModalProps> = ({
  visible,
  currentPeriod,
  onSelectPeriod,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/75 justify-center items-center p-4">
        <View className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 shadow-2xl">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-white">Seleccionar Periodo</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-slate-400 font-bold text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-slate-400 text-xs mb-4">
            Mantén pulsado 3s para abrir este selector. Selecciona el periodo al que deseas cambiar:
          </Text>

          <View className="space-y-2 mb-2">
            {PERIOD_LIST.map((item) => {
              const isActive = item.key === currentPeriod;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectPeriod(item.key);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between p-3 rounded-xl border mb-2 ${
                    isActive
                      ? "bg-amber-500/20 border-amber-500"
                      : "bg-slate-800/80 border-slate-700 hover:bg-slate-750"
                  }`}
                >
                  <View className="flex-row items-center space-x-3">
                    <View
                      className={`w-10 h-10 rounded-lg items-center justify-center font-bold ${
                        isActive ? "bg-amber-500" : "bg-slate-700"
                      }`}
                    >
                      <Text
                        className={`font-extrabold text-sm ${
                          isActive ? "text-slate-950" : "text-white"
                        }`}
                      >
                        {item.label}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-semibold text-base">{item.label}</Text>
                      <Text className="text-slate-400 text-xs">{item.desc}</Text>
                    </View>
                  </View>
                  {isActive && <Text className="text-amber-400 font-bold text-base">✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="mt-2 py-3 rounded-xl bg-slate-800 items-center justify-center border border-slate-700"
          >
            <Text className="text-slate-300 font-semibold text-sm">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
