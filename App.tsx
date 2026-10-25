import "./index.css";
import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, LogBox } from "react-native";
import ClubManage from "./src/page/ClubManage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "./src/db";
import { useNotificationLifecycle } from "./src/features/notifications/hooks/useNotificationLifecycle";

// Ignore third-party library registration of deprecated React Native SafeAreaView (e.g. react-native-css-interop)
LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export default function App() {
  useNotificationLifecycle();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        initDatabase();
        setIsReady(true);
      } catch (err: any) {
        console.error("Database initialization error:", err);
        setError(err.message || "Failed to initialize database");
        setIsReady(true); // Allow UI render even on error fallback
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-surface" style={styles.container}>
        <ClubManage />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1326",
  },
});
