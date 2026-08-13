import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { initializeDatabase } from "./src/utils/database";
import { Navigation } from "./src/routes/AppRoute";

export default function App() {
  const [dbReady, setDbReady] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        console.log(err)
        setInitError("Failed to initialize storage.");
      }
    };

    setup();
  }, []);

  if (initError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{initError}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing Database...</Text>
      </View>
    );
  }

  return <Navigation />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { color: "red", fontSize: 16 },
});
