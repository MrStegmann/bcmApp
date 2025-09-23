import "./index.css";
import { View } from "react-native";
import ClubManage from "./src/page/ClubManage";
import { DBProvider } from "./src/context/DBProvider";

export default function App() {
  return (
    <DBProvider>
      <View className="flex-1 items-center justify-center">
        <ClubManage />
      </View>
    </DBProvider>
  );
}
