/**
 * Authentication domain types, DTOs, and contracts.
 */

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface UserProfileDto {
  id: number;
  username: string;
  status: string;
  createdAt: string;
}

export interface LoginSuccessResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfileDto;
}

export interface LoginErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface CachedSessionPayload {
  token: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  user: UserProfileDto;
}

export type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

export interface AuthValidationError {
  username?: string;
  password?: string;
}

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: UserProfileDto | null;
  expiresAt: string | null;
  usernameInput: string;
  passwordInput: string;
  isSubmitting: boolean;
  validationError: AuthValidationError | null;
  apiError: string | null;
}

export interface AuthActions {
  setUsernameInput: (username: string) => void;
  setPasswordInput: (password: string) => void;
  clearErrors: () => void;
  validateForm: () => boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  resetForm: () => void;
}

export type AuthStore = AuthState & AuthActions;

