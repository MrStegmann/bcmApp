/**
 * Contract: Encrypted Secure Storage Service
 * Wraps expo-secure-store for hardware-backed keychain/keystore encryption.
 */

export interface RememberedCredentials {
  username: string;
  password?: string;
  savedAt: string;
}

export interface ISecureStorageService {
  /**
   * Persists user credentials in encrypted storage when Remember Me is enabled.
   */
  saveCredentials(credentials: RememberedCredentials): Promise<void>;

  /**
   * Retrieves stored credentials if present; returns null if none saved.
   */
  getCredentials(): Promise<RememberedCredentials | null>;

  /**
   * Clears stored credentials and disables remember me.
   */
  clearCredentials(): Promise<void>;

  /**
   * Checks if Remember Me is currently enabled.
   */
  isRememberMeEnabled(): Promise<boolean>;

  /**
   * Sets the Remember Me toggle status.
   */
  setRememberMeEnabled(enabled: boolean): Promise<void>;
}

