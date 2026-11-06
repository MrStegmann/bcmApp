import { useAuthStore } from "../../store/useAuthStore";

describe("LoginView Error Banner & Retry State (US5, FR-007, FR-008, SC-007)", () => {
  beforeEach(() => {
    useAuthStore.getState().resetForm();
    useAuthStore.setState({
      status: "unauthenticated",
      apiError: null,
      isSubmitting: false,
    });
  });

  it("stores apiError and exposes dismiss/retry capabilities", () => {
    useAuthStore.setState({
      apiError: "Credenciales inválidas. Por favor, revisa tu usuario y contraseña.",
      isSubmitting: false,
    });

    const state = useAuthStore.getState();
    expect(state.apiError).toBe("Credenciales inválidas. Por favor, revisa tu usuario y contraseña.");
    expect(state.isSubmitting).toBe(false);

    // Calling clearErrors dismisses the banner
    useAuthStore.getState().clearErrors();
    expect(useAuthStore.getState().apiError).toBeNull();
  });

  it("clears apiError automatically when user updates username or password input to retry", () => {
    useAuthStore.setState({
      apiError: "Error de conexión. Verifica tu conexión a internet o el estado del servidor.",
    });

    useAuthStore.getState().setUsernameInput("NewUsername");
    expect(useAuthStore.getState().apiError).toBeNull();

    useAuthStore.setState({
      apiError: "Another error",
    });

    useAuthStore.getState().setPasswordInput("NewPassword");
    expect(useAuthStore.getState().apiError).toBeNull();
  });
});

