import * as SecureStore from "expo-secure-store";
import { RememberedCredentials } from "../types";

const CREDENTIALS_KEY = "bcm_remember_me_credentials";
const REMEMBER_ME_ENABLED_KEY = "bcm_remember_me_enabled";

export interface ISecureStorageService {
  saveCredentials(credentials: RememberedCredentials): Promise<void>;
  getCredentials(): Promise<RememberedCredentials | null>;
  clearCredentials(): Promise<void>;
  isRememberMeEnabled(): Promise<boolean>;
  setRememberMeEnabled(enabled: boolean): Promise<void>;
}

export const secureStorageService: ISecureStorageService = {
  async saveCredentials(credentials: RememberedCredentials): Promise<void> {
    try {
      const payload = JSON.stringify(credentials);
      await SecureStore.setItemAsync(CREDENTIALS_KEY, payload);
      await SecureStore.setItemAsync(REMEMBER_ME_ENABLED_KEY, "true");
    } catch (error) {
      console.warn("secureStorageService.saveCredentials error:", error);
    }
  },

  async getCredentials(): Promise<RememberedCredentials | null> {
    try {
      const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as RememberedCredentials;
      if (!parsed || !parsed.username) {
        await this.clearCredentials();
        return null;
      }
      return parsed;
    } catch {
      await this.clearCredentials();
      return null;
    }
  },

  async clearCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
      await SecureStore.deleteItemAsync(REMEMBER_ME_ENABLED_KEY);
    } catch (error) {
      console.warn("secureStorageService.clearCredentials error:", error);
    }
  },

  async isRememberMeEnabled(): Promise<boolean> {
    try {
      const flag = await SecureStore.getItemAsync(REMEMBER_ME_ENABLED_KEY);
      return flag === "true";
    } catch {
      return false;
    }
  },

  async setRememberMeEnabled(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        await SecureStore.setItemAsync(REMEMBER_ME_ENABLED_KEY, "true");
      } else {
        await this.clearCredentials();
      }
    } catch (error) {
      console.warn("secureStorageService.setRememberMeEnabled error:", error);
    }
  },
};

