import { StyleSheet } from "react-native";

export const loginScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});

export const loginFormStyles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 12,
    height: 56,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonActive: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
