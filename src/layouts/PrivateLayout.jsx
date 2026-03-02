import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../components/Header";

const PrivateLayout = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        {children}
      </KeyboardAwareScrollView>
      <Header />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  contentContainer: {
    flexGrow: 1, // ScrollView se expande
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
  },
});

export default PrivateLayout;
