import { Text, View } from "react-native";
import { useAlertStore } from "../store/AlertStore";

const Alerts = () => {
  const alerts = useAlertStore((state) => state.alerts);

  return (
    <View className="w-full absolute top-28 z-50 flex justify-center items-center">
      {alerts.length > 0 && (
        <View className="w-3/4 border-danish-red border-2 bg-danish-white rounded-3xl p-2">
          {alerts.map((a) => (
            <Text key={a.id} className="text-danish-dark-gray text-center">
              {a.msg}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default Alerts;
