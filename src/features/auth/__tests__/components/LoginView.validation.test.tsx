import { useAuthStore } from "../../store/useAuthStore";

describe("LoginView Form Validation Interactions (US3, FR-003, SC-004)", () => {
  beforeEach(() => {
    useAuthStore.getState().resetForm();
    useAuthStore.setState({
      status: "unauthenticated",
      token: null,
      user: null,
      validationError: null,
      apiError: null,
      isSubmitting: false,
    });
  });

  it("clears username validation error immediately when user begins typing username", () => {
    useAuthStore.setState({
      validationError: {
        username: "El usuario no puede estar vacío",
        password: "La contraseña no puede estar vacía",
      },
    });

    useAuthStore.getState().setUsernameInput("P");

    const state = useAuthStore.getState();
    expect(state.validationError?.username).toBeUndefined();
    expect(state.validationError?.password).toBe("La contraseña no puede estar vacía");
  });

  it("clears password validation error immediately when user begins typing password", () => {
    useAuthStore.setState({
      validationError: {
        username: "El usuario no puede estar vacío",
        password: "La contraseña no puede estar vacía",
      },
    });

    useAuthStore.getState().setPasswordInput("s");

    const state = useAuthStore.getState();
    expect(state.validationError?.password).toBeUndefined();
    expect(state.validationError?.username).toBe("El usuario no puede estar vacío");
  });

  it("clears all errors when clearErrors is called", () => {
    useAuthStore.setState({
      validationError: { username: "Error", password: "Error" },
      apiError: "Error de red",
    });

    useAuthStore.getState().clearErrors();

    const state = useAuthStore.getState();
    expect(state.validationError).toBeNull();
    expect(state.apiError).toBeNull();
  });
});

