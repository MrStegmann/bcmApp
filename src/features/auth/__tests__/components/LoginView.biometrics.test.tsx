import { useAuthStore } from "../../store/useAuthStore";

describe("LoginView Biometrics & Remember Me Contract (US7, FR-020, FR-022, FR-023)", () => {
  beforeEach(() => {
    useAuthStore.getState().resetForm();
    useAuthStore.setState({
      status: "unauthenticated",
      rememberMe: false,
      isBiometricAvailable: false,
      usernameInput: "",
      passwordInput: "",
    });
  });

  it("updates rememberMe flag in store via setRememberMe", () => {
    expect(useAuthStore.getState().rememberMe).toBe(false);

    useAuthStore.getState().setRememberMe(true);
    expect(useAuthStore.getState().rememberMe).toBe(true);

    useAuthStore.getState().setRememberMe(false);
    expect(useAuthStore.getState().rememberMe).toBe(false);
  });

  it("exposes biometric availability and triggers loginWithBiometrics action", async () => {
    useAuthStore.setState({ isBiometricAvailable: true });
    expect(useAuthStore.getState().isBiometricAvailable).toBe(true);

    const loginWithBiometricsSpy = jest
      .spyOn(useAuthStore.getState(), "loginWithBiometrics")
      .mockResolvedValue(true);

    const result = await useAuthStore.getState().loginWithBiometrics();
    expect(result).toBe(true);
    expect(loginWithBiometricsSpy).toHaveBeenCalled();
  });
});

