import React, { useRef, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native-web";
import StopwatchTimer from "react-native-animated-stopwatch-timer";
import {
  useMatchCronoStore,
  useMatchTeamFalts,
  useMatchTeamResult,
} from "../../store/MatchStore";

const VisualFalts = React.memo(({ falts }) => {
  return (
    <View className="flex flex-row gap-2">
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 0 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 1 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 2 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 3 ? "bg-danish-gold" : "bg-danish-light-gray"}`}
      />
      <View
        className={`w-2 h-3 border border-danish-red rounded-full ${falts > 4 ? "bg-danish-red" : "bg-danish-light-gray"}`}
      />
    </View>
  );
});

const CronoMatch = ({
  opponentResult,
  opponentFalts,
  setTime,
  time,
  quarter,
}) => {
  const teamResultStore = useMatchTeamResult((state) => state);
  const teamFaltsStore = useMatchTeamFalts((state) => state);
  const crono = useMatchCronoStore((state) => state.crono);
  const setCrono = useMatchCronoStore((state) => state.setCrono);
  const stopwatchTimerRef = useRef(null); // Referencia para el Crono. Necesario para que funcione la librería correctamente

  // Control del Crono
  const play = useCallback(() => stopwatchTimerRef.current?.play(), []);
  const pause = useCallback(() => stopwatchTimerRef.current?.pause(), []);
  const getTime = useCallback(
    () => stopwatchTimerRef.current?.getSnapshot(),
    [],
  );

  const handleCrono = () => {
    if (crono) {
      setCrono(false);
      pause();
      setTime({ ...time, [quarter]: getTime() });
    } else {
      setCrono(true);
      play();
    }
  };

  const handleSetFinishCrono = () => {
    setCrono(false);
    setTime({ ...time, [quarter]: 0 });
  };
  return (
    <View className="w-1/2 flex flex-row justify-between items-center mt-1 ml-5">
      <VisualFalts falts={teamFaltsStore.teamFalt[quarter]} />
      <Text className="text-danish-white text-xs font-bold text-center">
        {teamResultStore.teamResult[quarter]}
      </Text>
      <TouchableOpacity
        onPress={handleCrono}
        className="px-2 py-1 border border-danish-red rounded-3xl flex justify-center items-center bg-danish-dark-gray"
      >
        <StopwatchTimer
          mode="timer"
          key={quarter}
          ref={stopwatchTimerRef}
          initialTimeInMs={time[quarter]}
          animationDelay={0}
          animationDuration={0}
          onFinish={handleSetFinishCrono}
          containerStyle={{
            display: "flex",
            justifyContent: "center",
          }}
          textCharStyle={{
            color: "#F8F8F8",
            fontSize: 14,
            lineHeight: 20,
          }}
        />
      </TouchableOpacity>

      <Text className="text-danish-white text-xs font-bold text-center">
        {opponentResult[quarter]}
      </Text>
      <VisualFalts falts={opponentFalts[quarter]} />
    </View>
  );
};

export default CronoMatch;
