import { useAuthStore } from "../../store/useAuthStore";
import { secureStorageService } from "../../services/secureStorageService";
import { biometricService } from "../../services/biometricService";

jest.mock("../../services/secureStorageService");
jest.mock("../../services/biometricService");
jest.mock("../../db/authSessionRepository");

describe("useAuthLifecycle - Biometric Initialization & Fast-Login (US7, SC-010, SC-012)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      status: "unauthenticated",
      rememberMe: false,
      isBiometricAvailable: false,
      usernameInput: "",
      passwordInput: "",
    });
  });

  it("initializes biometric status and pre-fills remembered username on init", async () => {
    (biometricService.isBiometricAvailable as jest.Mock).mockResolvedValue(true);
    (secureStorageService.isRememberMeEnabled as jest.Mock).mockResolvedValue(true);
    (secureStorageService.getCredentials as jest.Mock).mockResolvedValue({
      username: "Patrick.JS",
      password: "savedSecret123",
      savedAt: "2026-11-06T00:00:00Z",
    });

    await useAuthStore.getState().initBiometricsAndRememberedUser();

    const state = useAuthStore.getState();
    expect(state.isBiometricAvailable).toBe(true);
    expect(state.rememberMe).toBe(true);
    expect(state.usernameInput).toBe("Patrick.JS");
  });

  it("performs fast-login when biometrics succeed using remembered credentials", async () => {
    (secureStorageService.getCredentials as jest.Mock).mockResolvedValue({
      username: "Patrick.JS",
      password: "savedSecret123",
      savedAt: "2026-11-06T00:00:00Z",
    });
    (biometricService.authenticateUser as jest.Mock).mockResolvedValue({ success: true });

    const loginSpy = jest.spyOn(useAuthStore.getState(), "login").mockResolvedValue(true);

    const success = await useAuthStore.getState().loginWithBiometrics();

    expect(success).toBe(true);
    expect(useAuthStore.getState().passwordInput).toBe("savedSecret123");
    expect(loginSpy).toHaveBeenCalled();
  });

  it("gracefully leaves form intact and ready for manual input when biometrics fail or are cancelled", async () => {
    (secureStorageService.getCredentials as jest.Mock).mockResolvedValue({
      username: "Patrick.JS",
      password: "savedSecret123",
      savedAt: "2026-11-06T00:00:00Z",
    });
    (biometricService.authenticateUser as jest.Mock).mockResolvedValue({
      success: false,
      error: "user_cancel",
    });

    const loginSpy = jest.spyOn(useAuthStore.getState(), "login");

    const success = await useAuthStore.getState().loginWithBiometrics();

    expect(success).toBe(false);
    expect(loginSpy).not.toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
  });
});

