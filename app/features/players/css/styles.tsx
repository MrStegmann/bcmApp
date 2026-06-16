import { StyleSheet } from "react-native";

export const playerDetailScreenStyles = StyleSheet.create({
  container: {
    gap: 14,
    padding: 16,
  },
  title: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  row: {
    borderBottomColor: "#f3f4f6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    textAlign: "right",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  statsSection: {
    gap: 10,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  statsLoader: {
    marginVertical: 8,
  },
  emptyStatsText: {
    color: "#6b7280",
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  totalStatsCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  totalStatsTitle: {
    color: "#1e3a8a",
    fontSize: 15,
    fontWeight: "700",
  },
  statsMatchTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  statsRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsLabel: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: "600",
  },
  statsValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
});

export const playerFormScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 14,
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
    justifyContent: "center",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    color: "#111827",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#d92d20",
  },
  roleSelectContainer: {
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 46,
    padding: 8,
  },
  roleOption: {
    borderColor: "#c5cbd3",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roleOptionSelected: {
    backgroundColor: "#0b5fff",
    borderColor: "#0b5fff",
  },
  roleOptionText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  roleOptionTextSelected: {
    color: "#ffffff",
  },
  helperText: {
    color: "#4b5563",
    fontSize: 13,
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  errorText: {
    color: "#d92d20",
    fontSize: 13,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#0b5fff",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: "#8fb2ff",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export const playersListScreenStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  listContainer: { paddingBottom: 32 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: { fontSize: 16, fontWeight: "bold" },
  itemSubText: { fontSize: 14, color: "#666", marginLeft: 12 },
  actions: { flexDirection: "row" },
  actionButton: { marginLeft: 8, padding: 6 },
  actionButtonText: { color: "#007bff" },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#d92d20",
    borderRadius: 8,
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  disabledDeleteButton: {
    backgroundColor: "#e27870",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: { textAlign: "center", color: "#888", marginTop: 32 },
});
