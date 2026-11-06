import "./index.css";
import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, LogBox } from "react-native";
import ClubManage from "./src/page/ClubManage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "./src/db";
import { useNotificationLifecycle } from "./src/features/notifications/hooks/useNotificationLifecycle";
import { useAuthLifecycle, LoginView, useAuthStore } from "./src/features/auth";

// Ignore third-party library registration of deprecated React Native SafeAreaView (e.g. react-native-css-interop)
LogBox.ignoreAllLogs(true);

export default function App() {
  useNotificationLifecycle();
  useAuthLifecycle();

  const authStatus = useAuthStore((state) => state.status);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        initDatabase();
        await useAuthStore.getState().checkSession();
        setIsReady(true);
      } catch (err: any) {
        console.error("Database initialization error:", err);
        setError(err.message || "Failed to initialize database");
        useAuthStore.setState({ status: "unauthenticated" });
        setIsReady(true); // Allow UI render even on error fallback
      }
    }
    prepare();
  }, []);

  if (!isReady || authStatus === "checking" || authStatus === "idle") {
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
        {authStatus === "authenticated" ? <ClubManage /> : <LoginView />}
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
