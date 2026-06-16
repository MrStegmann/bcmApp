import { StyleSheet } from "react-native";

// Modificar según necesidad
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
}); export const gameDetailScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  row: {
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  label: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
});

export const gameFormScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: "#d92d20",
  },
  dateText: {
    color: "#111827",
    fontSize: 16,
  },
  roleSelectContainer: {
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
  },
  roleOption: {
    borderColor: "#c5cbd3",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  roleOptionSelected: {
    backgroundColor: "#0b5fff",
    borderColor: "#0b5fff",
  },
  roleOptionText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
  roleOptionTextSelected: {
    color: "#ffffff",
  },
  errorText: {
    color: "#d92d20",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  passwordActions: {
    flexDirection: "row",
    gap: 8,
  },
  inlineSecondaryButton: {
    alignItems: "center",
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  inlineSecondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0b5fff",
    borderRadius: 8,
    flex: 1,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#7aa8ff",
  },
});

export const gameListScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  createButton: {
    backgroundColor: "#0b5fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  listContainer: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
    width: "20%",
  },
  gameInfoColumn: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  gameHeader: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  gameScoreText: {
    color: "#4B5563",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    textAlignVertical: "center",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  gamePeriodsText: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#d1d5db",
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
  },
  viewButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 8,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d92d20",
    borderRadius: 8,
    padding: 8,
  },
  startButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#12b76a",
    borderRadius: 8,
    padding: 8,
  },
  disabledDeleteButton: {
    backgroundColor: "#e27870",
  },
});

export const gameRosterScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "600",
  },
  listContainer: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  checkboxContainer: {
    marginRight: 16,
  },
  playerInfoContainer: {
    flex: 1,
  },
  playerHeader: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "600",
  },
  playerStats: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#6B7280",
    fontSize: 15,
  },
});

