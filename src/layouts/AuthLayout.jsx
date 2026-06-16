import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-web";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AuthLayout = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1, // ScrollView se expande
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
  },
});

export default AuthLayout;
