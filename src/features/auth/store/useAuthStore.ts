import { create } from "zustand";
import { AuthStore, AuthState, AuthValidationError } from "../types";
import { authService, AuthApiError } from "../services/authService";
import { authSessionRepository } from "../db/authSessionRepository";
import { secureStorageService } from "../services/secureStorageService";
import { biometricService } from "../services/biometricService";

const initialAuthState: AuthState = {
  status: "idle",
  token: null,
  user: null,
  expiresAt: null,
  usernameInput: "",
  passwordInput: "",
  rememberMe: false,
  isBiometricAvailable: false,
  isSubmitting: false,
  validationError: null,
  apiError: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialAuthState,

  setRememberMe: (enabled: boolean) => {
    set({ rememberMe: enabled });
  },

  setUsernameInput: (username: string) => {
    set((state) => ({
      usernameInput: username,
      apiError: null,
      validationError: state.validationError
        ? { ...state.validationError, username: undefined }
        : null,
    }));
  },

  setPasswordInput: (password: string) => {
    set((state) => ({
      passwordInput: password,
      apiError: null,
      validationError: state.validationError
        ? { ...state.validationError, password: undefined }
        : null,
    }));
  },

  clearErrors: () => {
    set({ validationError: null, apiError: null });
  },

  validateForm: () => {
    const { usernameInput, passwordInput } = get();
    const errors: AuthValidationError = {};

    if (!usernameInput || !usernameInput.trim()) {
      errors.username = "El usuario no puede estar vacío";
    }

    if (!passwordInput || !passwordInput.trim()) {
      errors.password = "La contraseña no puede estar vacía";
    }

    const hasErrors = Object.keys(errors).length > 0;

    set({
      validationError: hasErrors ? errors : null,
    });

    return !hasErrors;
  },

  login: async () => {
    const { isSubmitting, usernameInput, passwordInput, validateForm } = get();

    if (isSubmitting) {
      return false;
    }

    const isValid = validateForm();
    if (!isValid) {
      return false;
    }

    set({ isSubmitting: true, apiError: null });

    try {
      const response = await authService.login({
        username: usernameInput.trim(),
        password: passwordInput,
      });

      const expiresAt = authService.calculateExpiresAt(response.expiresIn);

      await authSessionRepository.saveSession({
        token: response.token,
        tokenType: response.tokenType || "Bearer",
        expiresIn: response.expiresIn,
        expiresAt,
        user: response.user,
      });

      if (get().rememberMe) {
        await secureStorageService.saveCredentials({
          username: usernameInput.trim(),
          password: passwordInput,
          savedAt: new Date().toISOString(),
        });
      } else {
        await secureStorageService.clearCredentials();
      }

      set({
        status: "authenticated",
        token: response.token,
        user: response.user,
        expiresAt,
        isSubmitting: false,
        passwordInput: "",
        apiError: null,
      });

      return true;
    } catch (error: any) {
      const errorMessage =
        error?.message || "Ocurrió un error inesperado al iniciar sesión.";

      set({
        status: "unauthenticated",
        isSubmitting: false,
        apiError: errorMessage,
      });

      return false;
    }
  },

  logout: async () => {
    try {
      await authSessionRepository.clearSession();
    } catch {}

    set({
      status: "unauthenticated",
      token: null,
      user: null,
      expiresAt: null,
      usernameInput: "",
      passwordInput: "",
      apiError: null,
      validationError: null,
    });
  },

  checkSession: async () => {
    set({ status: "checking" });

    try {
      const session = await authSessionRepository.getActiveSession();

      if (session && authSessionRepository.isSessionValid(session)) {
        set({
          status: "authenticated",
          token: session.token,
          expiresAt: session.expiresAt,
          user: {
            id: session.userId,
            username: session.username,
            status: session.userStatus,
            createdAt: session.userCreatedAt,
          },
        });
        return true;
      }

      // Expired or invalid session: purge
      await authSessionRepository.clearSession();

      set({
        status: "unauthenticated",
        token: null,
        user: null,
        expiresAt: null,
      });
      return false;
    } catch {
      try {
        await authSessionRepository.clearSession();
      } catch {}

      set({
        status: "unauthenticated",
        token: null,
        user: null,
        expiresAt: null,
      });
      return false;
    }
  },

  loginWithBiometrics: async () => {
    try {
      const creds = await secureStorageService.getCredentials();
      if (!creds || !creds.username || !creds.password) {
        return false;
      }

      const bioResult = await biometricService.authenticateUser();
      if (!bioResult.success) {
        return false;
      }

      set({
        usernameInput: creds.username,
        passwordInput: creds.password,
      });

      return await get().login();
    } catch {
      return false;
    }
  },

  initBiometricsAndRememberedUser: async () => {
    try {
      const isBio = await biometricService.isBiometricAvailable();
      const rememberEnabled = await secureStorageService.isRememberMeEnabled();
      const creds = await secureStorageService.getCredentials();

      set({
        isBiometricAvailable: isBio,
        rememberMe: rememberEnabled,
        usernameInput: creds?.username || get().usernameInput,
      });
    } catch (error) {
      console.warn("initBiometricsAndRememberedUser error:", error);
    }
  },

  resetForm: () => {
    set({
      usernameInput: "",
      passwordInput: "",
      isSubmitting: false,
      validationError: null,
      apiError: null,
    });
  },
}));

