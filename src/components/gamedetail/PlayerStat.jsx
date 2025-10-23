import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";
import StatsEnums from "../../Enums/StatsEnums";
import { MaterialIcons } from "@expo/vector-icons";

// --- Componente Auxiliar para Contadores Genéricos (Rebotes, Asistencias, Pérdidas) ---
const StatCounter = React.memo(
  ({ statKey, currentValue, increment, decrement }) => {
    return (
      <View
        className={`w-16 h-16 p-2 flex flex-col justify-center items-center border border-danish-red`}
      >
        <Text className="text-danish-white text-xs text-center mb-1 capitalize">
          {statKey}
        </Text>
        <View className="w-full flex flex-row">
          <TouchableOpacity
            onPress={() => decrement(statKey)}
            style={{ padding: 0, marginRight: -10, marginLeft: -5 }}
          >
            <MaterialIcons name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-danish-white text-xs text-center mb-1 capitalize w-full">
            {currentValue}
          </Text>
          <TouchableOpacity
            onPress={() => increment(statKey)}
            style={{ padding: 0, marginRight: -5, marginLeft: -10 }}
          >
            <MaterialIcons name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

// --- Configuración de Estadísticas para mapeo ---
const STATS_CONFIG = [
  StatsEnums.t1a,
  StatsEnums.t1i,
  StatsEnums.t2a,
  StatsEnums.t2i,
  StatsEnums.t3a,
  StatsEnums.t3i,
  StatsEnums.falt,
  StatsEnums.dreb,
  StatsEnums.oreb,
  StatsEnums.asis,
  StatsEnums.rec,
  StatsEnums.per,
];

const PlayerStat = React.memo(({ player, setPlayers, index, onClose }) => {
  if (!player) return null;
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const minutes = Math.floor(player.minutes / 60000);
    const seconds = Math.floor((player.minutes % 60000) / 1000);
    setTime({ minutes, seconds });
  }, [player]);

  const addStat = (stat) => {
    const newPlayer = { ...player };
    const prev = newPlayer[stat];

    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const shotI =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      newPlayer[shotI] = newPlayer[shotI] + 1;
    }

    if (stat === StatsEnums.minutes) {
      newPlayer[stat] = prev < 60000 ? 60000 : prev + 60000;
    } else {
      newPlayer[stat] = prev + 1;
    }

    setPlayers((bef) => ({ ...bef, [index]: newPlayer }));
  };

  const substractStat = (stat) => {
    const newPlayer = { ...player };
    const prev = newPlayer[stat];

    if ([StatsEnums.t1a, StatsEnums.t2a, StatsEnums.t3a].includes(stat)) {
      const shotI =
        stat === StatsEnums.t1a
          ? StatsEnums.t1i
          : stat === StatsEnums.t2a
            ? StatsEnums.t2i
            : StatsEnums.t3i;
      newPlayer[shotI] = Math.max(0, newPlayer[shotI] - 1);
    }

    if (stat === StatsEnums.minutes) {
      newPlayer[stat] = Math.max(0, prev - 60000);
    } else {
      newPlayer[stat] = Math.max(0, prev - 1);
    }

    setPlayers((bef) => ({ ...bef, [index]: newPlayer }));
  };

  const pts =
    (player.t1i || 0) * 1 + (player.t2i || 0) * 2 + (player.t3i || 0) * 3;

  return (
    <View className="w-full flex-1 bg-danish-dark-gray z-10 my-1 flex flex-col items-center absolute border border-danish-red rounded-xl">
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        hideHours
        hideDays
        onConfirm={(pickedDuration) => {
          setTime({
            minutes: pickedDuration.minutes,
            seconds: pickedDuration.seconds,
          });
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        styles={{
          theme: "dark",
          confirmButton: {
            backgroundColor: "#1D2633",
            borderColor: "#FFD700",
          },
          cancelButton: { backgroundColor: "#1D2633", borderColor: "#78081d" },
        }}
        modalProps={{
          overlayOpacity: 0.2,
        }}
      />
      <View className="w-full px-2 py-3 flex justify-center items-center border-b border-danish-white">
        <Text className="text-sm text-danish-white">
          {`${player.number} - ${player.first_name} ${player.last_name}`}
        </Text>
      </View>

      <View className="w-16 h-16 p-2 flex flex-col justify-center items-center">
        <Text className="text-danish-white text-sm text-center mb-1">Pts</Text>
        <Text className="text-danish-white text-sm text-center">{pts}</Text>
      </View>

      <View className="w-full flex flex-row flex-wrap justify-between p-2 gap-2">
        <View className="w-16 h-16 p-2 flex flex-col justify-center items-center border border-danish-red">
          <Text className="text-danish-white text-sm text-center mb-1">
            Min
          </Text>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text className="text-danish-white text-sm text-center">
              {`${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")} `}
            </Text>
          </TouchableOpacity>
        </View>

        {STATS_CONFIG.map((key) => (
          <StatCounter
            key={key}
            statKey={key}
            currentValue={player[key] || 0}
            increment={addStat}
            decrement={substractStat}
          />
        ))}
      </View>

      <View className="w-full flex justify-center items-center my-2">
        <TouchableOpacity
          className="py-3 px-5 border border-danish-red flex justify-center items-center rounded-xl"
          onPress={onClose}
        >
          <Text className="text-danish-white text-sm text-center">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default PlayerStat;
