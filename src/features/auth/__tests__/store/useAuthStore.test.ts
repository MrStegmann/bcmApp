import { useAuthStore } from "../../store/useAuthStore";
import { authService, AuthApiError, NetworkTimeoutError } from "../../services/authService";
import { authSessionRepository } from "../../db/authSessionRepository";
import { LoginSuccessResponse } from "../../types";

jest.mock("../../services/authService", () => {
  const actual = jest.requireActual("../../services/authService");
  return {
    ...actual,
    authService: {
      login: jest.fn(),
      calculateExpiresAt: jest.fn(),
    },
  };
});
jest.mock("../../db/authSessionRepository");

describe("useAuthStore", () => {
  const mockSuccessResponse: LoginSuccessResponse = {
    token: "valid-jwt-token-abc",
    tokenType: "Bearer",
    expiresIn: 86400,
    user: {
      id: 42,
      username: "Patrick.JS",
      status: "ACTIVE",
      createdAt: "2026-11-01T09:49:33.990499Z",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().resetForm();
    useAuthStore.setState({
      status: "idle",
      token: null,
      user: null,
      expiresAt: null,
      isSubmitting: false,
      validationError: null,
      apiError: null,
    });
  });

  describe("T010 [US1]: Login Flow & Session Persistence", () => {
    it("successfully authenticates, saves session, and transitions state to authenticated", async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockSuccessResponse);
      (authService.calculateExpiresAt as jest.Mock).mockReturnValue("2026-11-03T15:00:00.000Z");
      (authSessionRepository.saveSession as jest.Mock).mockResolvedValue({ id: 1 });

      const store = useAuthStore.getState();
      store.setUsernameInput("Patrick.JS");
      store.setPasswordInput("secret123");

      const success = await store.login();

      expect(success).toBe(true);
      const state = useAuthStore.getState();
      expect(state.status).toBe("authenticated");
      expect(state.token).toBe("valid-jwt-token-abc");
      expect(state.user).toEqual(mockSuccessResponse.user);
      expect(state.expiresAt).toBe("2026-11-03T15:00:00.000Z");
      expect(state.passwordInput).toBe("");
      expect(state.isSubmitting).toBe(false);

      expect(authSessionRepository.saveSession).toHaveBeenCalledWith({
        token: "valid-jwt-token-abc",
        tokenType: "Bearer",
        expiresIn: 86400,
        expiresAt: "2026-11-03T15:00:00.000Z",
        user: mockSuccessResponse.user,
      });
    });

    it("prevents concurrent duplicate submissions while isSubmitting is true", async () => {
      useAuthStore.setState({ isSubmitting: true, usernameInput: "user", passwordInput: "pass" });

      const success = await useAuthStore.getState().login();

      expect(success).toBe(false);
      expect(authService.login).not.toHaveBeenCalled();
    });

    it("clears cached session on logout", async () => {
      useAuthStore.setState({
        status: "authenticated",
        token: "existing-token",
        user: mockSuccessResponse.user,
      });

      await useAuthStore.getState().logout();

      expect(authSessionRepository.clearSession).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.status).toBe("unauthenticated");
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
    });
  });

  describe("T020 [US3]: Client-Side Validation", () => {
    it("fails validation and blocks submission when username is empty or whitespace", async () => {
      const store = useAuthStore.getState();
      store.setUsernameInput("   ");
      store.setPasswordInput("validPass123");

      const valid = store.validateForm();
      expect(valid).toBe(false);
      expect(useAuthStore.getState().validationError?.username).toBe("El usuario no puede estar vacío");

      const loginSuccess = await store.login();
      expect(loginSuccess).toBe(false);
      expect(authService.login).not.toHaveBeenCalled();
    });

    it("fails validation when password is empty or whitespace", () => {
      const store = useAuthStore.getState();
      store.setUsernameInput("Patrick.JS");
      store.setPasswordInput("   ");

      const valid = store.validateForm();
      expect(valid).toBe(false);
      expect(useAuthStore.getState().validationError?.password).toBe("La contraseña no puede estar vacía");
    });

    it("clears validation error when user types into the input", () => {
      const store = useAuthStore.getState();
      store.validateForm();
      expect(useAuthStore.getState().validationError).not.toBeNull();

      store.setUsernameInput("Patrick.JS");
      expect(useAuthStore.getState().validationError?.username).toBeUndefined();

      store.setPasswordInput("secret");
      expect(useAuthStore.getState().validationError?.password).toBeUndefined();
    });
  });

  describe("T025 [US4]: Session Recovery and Expiry Check", () => {
    it("restores authenticated state on valid cached session", async () => {
      (authSessionRepository.getActiveSession as jest.Mock).mockResolvedValue({
        id: 1,
        token: "cached-token",
        tokenType: "Bearer",
        expiresIn: 3600,
        expiresAt: "2026-11-03T15:00:00.000Z",
        userId: 99,
        username: "RestoredUser",
        userStatus: "ACTIVE",
        userCreatedAt: "2026-11-01T00:00:00.000Z",
      });
      (authSessionRepository.isSessionValid as jest.Mock).mockReturnValue(true);

      const isValid = await useAuthStore.getState().checkSession();

      expect(isValid).toBe(true);
      const state = useAuthStore.getState();
      expect(state.status).toBe("authenticated");
      expect(state.token).toBe("cached-token");
      expect(state.user?.username).toBe("RestoredUser");
    });

    it("purges stale session and transitions to unauthenticated on expired session", async () => {
      (authSessionRepository.getActiveSession as jest.Mock).mockResolvedValue({
        id: 1,
        token: "expired-token",
        expiresAt: "2026-01-01T00:00:00.000Z",
      });
      (authSessionRepository.isSessionValid as jest.Mock).mockReturnValue(false);

      const isValid = await useAuthStore.getState().checkSession();

      expect(isValid).toBe(false);
      expect(authSessionRepository.clearSession).toHaveBeenCalled();
      const state = useAuthStore.getState();
      expect(state.status).toBe("unauthenticated");
      expect(state.token).toBeNull();
    });
  });

  describe("T028 [US5]: Error Handling in Store", () => {
    it("sets apiError when login service throws AuthApiError", async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new AuthApiError("Credenciales inválidas. Por favor, revisa tu usuario y contraseña.", 401)
      );

      const store = useAuthStore.getState();
      store.setUsernameInput("Patrick.JS");
      store.setPasswordInput("wrongpass");

      const success = await store.login();

      expect(success).toBe(false);
      const state = useAuthStore.getState();
      expect(state.status).toBe("unauthenticated");
      expect(state.apiError).toBe("Credenciales inválidas. Por favor, revisa tu usuario y contraseña.");
      expect(state.isSubmitting).toBe(false);
    });

    it("sets apiError when login service throws NetworkTimeoutError", async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new NetworkTimeoutError()
      );

      const store = useAuthStore.getState();
      store.setUsernameInput("Patrick.JS");
      store.setPasswordInput("pass");

      const success = await store.login();

      expect(success).toBe(false);
      const state = useAuthStore.getState();
      expect(state.apiError).toBe("Error de conexión. Verifica tu conexión a internet o el estado del servidor.");
      expect(state.isSubmitting).toBe(false);
    });
  });
});
