import React from "react";
import { Text, View } from "react-native";
import { useAlertStore } from "../store/AlertStore";

const Alerts: React.FC = () => {
  const alerts = useAlertStore((state) => state.alerts);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="w-full absolute top-28 z-50 flex justify-center items-center"
    >
      <View className="w-3/4 border-error-container border-2 bg-surface-elevated rounded-3xl p-3 shadow-xl">
        {alerts.map((a) => (
          <Text key={a.id} className="text-white text-center font-medium">
            {a.msg}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default Alerts;
