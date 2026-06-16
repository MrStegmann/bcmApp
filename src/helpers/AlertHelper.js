import { Alert } from "react-native-web";

export const delAlert = (itemName, onPress) => {
  Alert.alert(
    `Eliminar ${itemName}`,
    `¿Estás seguro de que deseas eliminar a ${itemName}? Esta decisión es irreversible y permanente.`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress,
      },
    ],
  );
};

export const infoAlert = (message) => {
  Alert.alert("Aviso", message, [{ text: "OK" }], { cancelable: true });
};

export const errorAlert = (message) => {
  Alert.alert("Error", message, [{ text: "OK" }], { cancelable: true });
};
