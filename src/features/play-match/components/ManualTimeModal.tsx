import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { ManualTimeModalProps } from "../types";

export const ManualTimeModal: React.FC<ManualTimeModalProps> = ({
  visible,
  currentSeconds,
  periodKey,
  onSaveTime,
  onClose,
}) => {
  const [mins, setMins] = useState<number>(Math.floor(currentSeconds / 60));
  const [secs, setSecs] = useState<number>(currentSeconds % 60);

  useEffect(() => {
    setMins(Math.floor(currentSeconds / 60));
    setSecs(currentSeconds % 60);
  }, [currentSeconds, visible]);

  const maxMins = periodKey === "extra" ? 5 : 10;

  const adjustMins = (delta: number) => {
    setMins((prev) => Math.min(maxMins, Math.max(0, prev + delta)));
  };

  const adjustSecs = (delta: number) => {
    setSecs((prev) => {
      let next = prev + delta;
      if (next >= 60) next = 59;
      if (next < 0) next = 0;
      return next;
    });
  };

  const setPreset = (m: number, s: number) => {
    setMins(Math.min(maxMins, m));
    setSecs(s);
  };

  const handleSave = () => {
    const total = mins * 60 + secs;
    onSaveTime(total);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/75 justify-center items-center p-4">
        <View className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 shadow-2xl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-white">Ajustar Tiempo</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-slate-400 font-bold text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-slate-400 text-xs mb-4">
            Modifica el tiempo restante para el periodo ({periodKey.toUpperCase()}):
          </Text>

          {/* Digital Time Picker Display */}
          <View className="flex-row justify-center items-center py-4 bg-slate-950 border border-slate-800 rounded-2xl mb-4">
            {/* Minutes Column */}
            <View className="items-center mx-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => adjustMins(1)}
                className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center mb-1"
              >
                <Text className="text-amber-400 font-extrabold text-base">▲</Text>
              </TouchableOpacity>
              <Text className="text-4xl font-extrabold text-white tracking-widest my-1 font-mono">
                {mins.toString().padStart(2, "0")}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => adjustMins(-1)}
                className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center mt-1"
              >
                <Text className="text-amber-400 font-extrabold text-base">▼</Text>
              </TouchableOpacity>
              <Text className="text-slate-400 text-xs mt-1">MIN</Text>
            </View>

            <Text className="text-4xl font-extrabold text-amber-500 font-mono mb-5">:</Text>

            {/* Seconds Column */}
            <View className="items-center mx-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => adjustSecs(5)}
                className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center mb-1"
              >
                <Text className="text-amber-400 font-extrabold text-base">▲</Text>
              </TouchableOpacity>
              <Text className="text-4xl font-extrabold text-white tracking-widest my-1 font-mono">
                {secs.toString().padStart(2, "0")}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => adjustSecs(-5)}
                className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center mt-1"
              >
                <Text className="text-amber-400 font-extrabold text-base">▼</Text>
              </TouchableOpacity>
              <Text className="text-slate-400 text-xs mt-1">SEG</Text>
            </View>
          </View>

          {/* Quick Presets */}
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={() => setPreset(maxMins, 0)}
              className="flex-1 mr-1 py-1.5 bg-slate-800 border border-slate-700 rounded-lg items-center"
            >
              <Text className="text-slate-300 font-semibold text-xs">{maxMins}:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPreset(5, 0)}
              className="flex-1 mx-1 py-1.5 bg-slate-800 border border-slate-700 rounded-lg items-center"
            >
              <Text className="text-slate-300 font-semibold text-xs">05:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPreset(1, 0)}
              className="flex-1 mx-1 py-1.5 bg-slate-800 border border-slate-700 rounded-lg items-center"
            >
              <Text className="text-slate-300 font-semibold text-xs">01:00</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPreset(0, 0)}
              className="flex-1 ml-1 py-1.5 bg-slate-800 border border-slate-700 rounded-lg items-center"
            >
              <Text className="text-slate-300 font-semibold text-xs">00:00</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            className="py-3.5 rounded-xl bg-amber-500 items-center justify-center mb-2"
          >
            <Text className="text-slate-950 font-bold text-base">Guardar Tiempo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 items-center justify-center"
          >
            <Text className="text-slate-400 font-semibold text-sm">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
