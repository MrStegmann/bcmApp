import { StyleSheet } from "react-native";

export const userDetailCardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  label: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
  },
  value: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
});

export const userDetailScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 14,
  },
  promoteButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 14,
  },
  promoteButtonDisabled: {
    opacity: 0.7,
  },
  promoteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export const userFormScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  input: {
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#111827",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  roleSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleOption: {
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  roleOptionSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  roleOptionText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
  },
  roleOptionTextSelected: {
    color: "#ffffff",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  passwordActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  inlineSecondaryButton: {
    alignItems: "center",
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  inlineSecondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#D1D5DB",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 12,
    flex: 1,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export const usersListScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
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
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  createButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  listContainer: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "#6B7280",
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
  card: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardActions: {
    gap: 8,
    marginLeft: 12,
  },
  name: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "600",
  },
  role: {
    color: "#4B5563",
    fontSize: 14,
    marginTop: 4,
  },
  editButton: {
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  viewButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#DC2626",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabledDeleteButton: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
