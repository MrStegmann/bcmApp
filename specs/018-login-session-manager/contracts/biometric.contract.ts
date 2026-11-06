/**
 * Contract: Biometric Authentication Service
 * Wraps expo-local-authentication for biometric sensors & prompts.
 */

export type BiometricAuthResult = {
  success: boolean;
  error?: string;
};

export interface IBiometricService {
  /**
   * Checks whether the device has biometric hardware and at least one enrolled biometric.
   */
  isBiometricAvailable(): Promise<boolean>;

  /**
   * Returns human-readable descriptor of available biometric hardware.
   */
  getBiometricType(): Promise<"FINGERPRINT" | "FACIAL_RECOGNITION" | "NONE">;

  /**
   * Prompts user with native biometric dialog.
   * Returns true on successful match; false on cancellation, failure, or refusal.
   */
  authenticateUser(promptMessage?: string): Promise<BiometricAuthResult>;
}

