import { useAuthStore } from "../../store/useAuthStore";

describe("Credential Validation Logic (US3, FR-002, FR-003, SC-004)", () => {
  beforeEach(() => {
    useAuthStore.getState().resetForm();
  });

  it("identifies empty username as invalid with Spanish error message", () => {
    useAuthStore.getState().setUsernameInput("");
    useAuthStore.getState().setPasswordInput("validPassword123");

    const isValid = useAuthStore.getState().validateForm();

    expect(isValid).toBe(false);
    expect(useAuthStore.getState().validationError?.username).toBe("El usuario no puede estar vacío");
    expect(useAuthStore.getState().validationError?.password).toBeUndefined();
  });

  it("identifies whitespace-only username as invalid", () => {
    useAuthStore.getState().setUsernameInput("    ");
    useAuthStore.getState().setPasswordInput("validPassword123");

    const isValid = useAuthStore.getState().validateForm();

    expect(isValid).toBe(false);
    expect(useAuthStore.getState().validationError?.username).toBe("El usuario no puede estar vacío");
  });

  it("identifies empty or whitespace-only password as invalid with Spanish error message", () => {
    useAuthStore.getState().setUsernameInput("Patrick.JS");
    useAuthStore.getState().setPasswordInput("   ");

    const isValid = useAuthStore.getState().validateForm();

    expect(isValid).toBe(false);
    expect(useAuthStore.getState().validationError?.password).toBe("La contraseña no puede estar vacía");
    expect(useAuthStore.getState().validationError?.username).toBeUndefined();
  });

  it("passes validation when both fields contain non-whitespace strings", () => {
    useAuthStore.getState().setUsernameInput("Patrick.JS");
    useAuthStore.getState().setPasswordInput("secret123");

    const isValid = useAuthStore.getState().validateForm();

    expect(isValid).toBe(true);
    expect(useAuthStore.getState().validationError).toBeNull();
  });
});

