import { Alert, AlertButton, AlertOptions, Platform } from "react-native";

type AlertParams = {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  options?: AlertOptions;
};

const useAppAlert = () => {
  const showAlert = ({ title, message, buttons, options }: AlertParams) => {
    if (Platform.OS !== "web") {
      Alert.alert(title, message, buttons, options);
      return;
    }

    const actionButtons = buttons ?? [];

    if (actionButtons.length <= 1) {
      globalThis.alert([title, message].filter(Boolean).join("\n\n"));
      actionButtons[0]?.onPress?.();
      return;
    }

    const destructiveButton = actionButtons.find(
      (button) => button.style === "destructive",
    );
    const cancelButton = actionButtons.find(
      (button) => button.style === "cancel",
    );
    const confirmButton = destructiveButton ?? actionButtons.at(-1);

    const confirmed = globalThis.confirm(
      [title, message].filter(Boolean).join("\n\n"),
    );

    if (confirmed) {
      confirmButton?.onPress?.();
      return;
    }

    cancelButton?.onPress?.();
  };

  const showError = (title: string, message: string) => {
    showAlert({ title, message });
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
  ) => {
    showAlert({
      title,
      message,
      buttons: [
        {
          style: "cancel",
          text: cancelText,
          onPress: onCancel,
        },
        {
          style: "destructive",
          text: confirmText,
          onPress: onConfirm,
        },
      ],
    });
  };

  return {
    showAlert,
    showError,
    showConfirmation,
  };
};

export { useAppAlert };
