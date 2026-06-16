import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppAlert } from "../../../shared";
import { loginWithEmailAndPassword } from "../api/authApi";
import { LoginForm } from "../components/LoginForm";
import { loginScreenStyles as styles } from "../css/styles";
import { useAuthStore } from "../store/authStore";
import { AuthData, LoginFormValues } from "../types";

type LoginScreenProps = {
  onLogin?: (
    values: LoginFormValues,
  ) => Promise<AuthData | void> | AuthData | void;
};

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const { showError } = useAppAlert();
  const [isLoading, setIsLoading] = useState(false);
  const saveAuth = useAuthStore((state) => state.saveAuth);

  const saveAuthOnSuccess = (authData: AuthData | void) => {
    if (!authData || !authData.name || !authData.email || !authData.token) {
      return false;
    }

    saveAuth(authData);
    return true;
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);

      if (onLogin) {
        const authData = await onLogin(values);
        saveAuthOnSuccess(authData);
      } else {
        const authData = await loginWithEmailAndPassword(values);
        saveAuthOnSuccess(authData);
      }
    } catch {
      showError("Login", "No fue posible iniciar sesion. Verifica tus datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <LoginForm isLoading={isLoading} onSubmit={handleLogin} />
    </SafeAreaView>
  );
};
