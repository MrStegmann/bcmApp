/**
 * Contract: Auth Zustand Store
 */

import { UserProfileDto } from "./auth-api.contract";

export type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

export interface AuthState {
  // Session & User State
  status: AuthStatus;
  token: string | null;
  user: UserProfileDto | null;
  expiresAt: string | null;

  // Form & Credential State
  usernameInput: string;
  passwordInput: string;
  rememberMe: boolean;
  isBiometricAvailable: boolean;
  isSubmitting: boolean;
  validationError: {
    username?: string;
    password?: string;
  } | null;
  apiError: string | null;
}

export interface AuthActions {
  // Form Actions
  setUsernameInput: (username: string) => void;
  setPasswordInput: (password: string) => void;
  setRememberMe: (enabled: boolean) => void;
  clearErrors: () => void;
  validateForm: () => boolean;

  // Authentication & Session Lifecycle Actions
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  loginWithBiometrics: () => Promise<boolean>;
  initBiometricsAndRememberedUser: () => Promise<void>;
  resetForm: () => void;
}

export type IAuthStore = AuthState & AuthActions;
