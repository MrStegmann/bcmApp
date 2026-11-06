import * as LocalAuthentication from "expo-local-authentication";
import { BiometricAuthResult, BiometricType } from "../types";

export interface IBiometricService {
  isBiometricAvailable(): Promise<boolean>;
  getBiometricType(): Promise<BiometricType>;
  authenticateUser(promptMessage?: string): Promise<BiometricAuthResult>;
}

export const biometricService: IBiometricService = {
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return false;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return isEnrolled;
    } catch {
      return false;
    }
  },

  async getBiometricType(): Promise<BiometricType> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return "NONE";
      }
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return "FACIAL_RECOGNITION";
      }
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return "FINGERPRINT";
      }
      return "NONE";
    } catch {
      return "NONE";
    }
  },

  async authenticateUser(
    promptMessage: string = "Inicia sesión con biometría en BasketApp"
  ): Promise<BiometricAuthResult> {
    try {
      const available = await this.isBiometricAvailable();
      if (!available) {
        return { success: false, error: "not_available" };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Usar contraseña manual",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: (result as any).error || "authentication_failed",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "unknown_error",
      };
    }
  },
};

