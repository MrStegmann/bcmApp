import "./index.css";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import ClubManage from "./src/page/ClubManage";
import { SafeAreaView } from "react-native-safe-area-context";
import { initDatabase } from "./src/db";
import { seedDatabase } from "./src/db/seed";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        initDatabase();
        await seedDatabase();
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
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900" style={styles.container} edges={["left", "right"]}>
      <ClubManage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
});
