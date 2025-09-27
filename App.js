import "./index.css";
import { StyleSheet } from "react-native";
import ClubManage from "./src/page/ClubManage";
import { DBProvider } from "./src/context/DBProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <DBProvider>
        <ClubManage />
      </DBProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
});
