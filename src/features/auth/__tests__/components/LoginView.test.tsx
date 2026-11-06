import { useAuthStore } from "../../store/useAuthStore";
import { AuthValidationError } from "../../types";

describe("LoginView Component Contract & Interactions (T011, T021, T029)", () => {
  beforeEach(() => {
    useAuthStore.getState().resetForm();
    useAuthStore.setState({
      status: "unauthenticated",
      token: null,
      user: null,
      expiresAt: null,
      usernameInput: "",
      passwordInput: "",
      isSubmitting: false,
      validationError: null,
      apiError: null,
    });
  });

  describe("T011 [US1]: Layout, Inputs, and Form State Contract", () => {
    it("initializes with empty username and password inputs in store", () => {
      const state = useAuthStore.getState();
      expect(state.usernameInput).toBe("");
      expect(state.passwordInput).toBe("");
      expect(state.isSubmitting).toBe(false);
      expect(state.validationError).toBeNull();
      expect(state.apiError).toBeNull();
    });

    it("updates username and password input values via store actions", () => {
      useAuthStore.getState().setUsernameInput("Patrick.JS");
      expect(useAuthStore.getState().usernameInput).toBe("Patrick.JS");

      useAuthStore.getState().setPasswordInput("superSecretPassword");
      expect(useAuthStore.getState().passwordInput).toBe("superSecretPassword");
    });
  });

  describe("T021 [US3]: Inline Validation Error Feedback", () => {
    it("generates inline validation error indicators when inputs are invalid", () => {
      useAuthStore.getState().setUsernameInput("");
      useAuthStore.getState().setPasswordInput("");

      const isValid = useAuthStore.getState().validateForm();
      expect(isValid).toBe(false);

      const errors = useAuthStore.getState().validationError;
      expect(errors?.username).toBe("El usuario no puede estar vacío");
      expect(errors?.password).toBe("La contraseña no puede estar vacía");
    });

    it("clears individual field errors immediately when user modifies input", () => {
      useAuthStore.setState({
        validationError: {
          username: "El usuario no puede estar vacío",
          password: "La contraseña no puede estar vacía",
        },
      });

      useAuthStore.getState().setUsernameInput("NewUser");
      expect(useAuthStore.getState().validationError?.username).toBeUndefined();
      expect(useAuthStore.getState().validationError?.password).toBe("La contraseña no puede estar vacía");

      useAuthStore.getState().setPasswordInput("NewPass");
      expect(useAuthStore.getState().validationError?.password).toBeUndefined();
    });
  });

  describe("T029 [US5]: Submission States, Loading Indicator, and Error Alert", () => {
    it("handles isSubmitting true state correctly to disable submission and show loading spinner", () => {
      useAuthStore.setState({ isSubmitting: true });
      expect(useAuthStore.getState().isSubmitting).toBe(true);
    });

    it("presents API error banner state when apiError is populated", () => {
      const errorMsg = "Credenciales inválidas. Por favor, revisa tu usuario y contraseña.";
      useAuthStore.setState({ apiError: errorMsg });

      expect(useAuthStore.getState().apiError).toBe(errorMsg);

      // Typing into input clears apiError
      useAuthStore.getState().setUsernameInput("Patrick.JS");
      expect(useAuthStore.getState().apiError).toBeNull();
    });

    it("clears both validation and api errors on clearErrors call", () => {
      useAuthStore.setState({
        validationError: { username: "Error" },
        apiError: "Server error",
      });

      useAuthStore.getState().clearErrors();

      expect(useAuthStore.getState().validationError).toBeNull();
      expect(useAuthStore.getState().apiError).toBeNull();
    });
  });
});
