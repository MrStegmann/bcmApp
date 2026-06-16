import { StyleSheet } from "react-native";

export const playgroundStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  courtContainer: {
    flex: 1,
    paddingBottom: 120, // Espacio exacto para la toolbar
  },
  sceneNav: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  sceneNavText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sceneNavDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
  },
});

export const playGroundOptionsStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "90%",
    maxHeight: "85%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 0,
  },
  scrollInner: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1F2937",
  },
  textArea: {
    minHeight: 80,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  chipText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  saveButtonDisabled: {
    backgroundColor: "#6EE7B7",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const toolbarStyles = StyleSheet.create({
  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  toolbarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftmostColumn: {
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    paddingRight: 10,
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  centerColumn: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
  },
  scenesColumn: {
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 10,
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightColumn: {
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 10,
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toolButtonActive: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  toolButtonDisabled: {
    opacity: 0.3,
  },
});
