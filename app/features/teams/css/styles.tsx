import { StyleSheet } from "react-native";

export const multiUserSelectorStyles = StyleSheet.create({
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600" },
  input: {
    borderColor: "#c5cbd3",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
});

export const teamFormScreenStyles = StyleSheet.create({
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
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
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

export const teamScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
});

export const teamsListScreenStyles = StyleSheet.create({
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
    gap: 8,
    marginLeft: 8,
  },
  name: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  role: {
    color: "#4B5563",
    fontSize: 14,
    marginTop: 4,
  },
  editButton: {
    borderColor: "#d1d5db",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#d92d20",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabledDeleteButton: {
    backgroundColor: "#e27870",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
