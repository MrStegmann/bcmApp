import { biometricService } from "../../services/biometricService";
import * as LocalAuthentication from "expo-local-authentication";

describe("biometricService (US7, FR-022, FR-023, SC-010, SC-012)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if ((LocalAuthentication as any).__resetMock) {
      (LocalAuthentication as any).__resetMock();
    }
  });

  it("returns true when hardware exists and biometrics are enrolled", async () => {
    (LocalAuthentication as any).__setMockCapabilities({
      hardware: true,
      enrolled: true,
      types: [LocalAuthentication.AuthenticationType.FINGERPRINT],
    });

    const isAvailable = await biometricService.isBiometricAvailable();
    expect(isAvailable).toBe(true);
  });

  it("returns false when hardware is missing or user is not enrolled", async () => {
    (LocalAuthentication as any).__setMockCapabilities({
      hardware: false,
      enrolled: false,
    });

    const isAvailable = await biometricService.isBiometricAvailable();
    expect(isAvailable).toBe(false);
  });

  it("correctly identifies biometric hardware type (FINGERPRINT / FACIAL_RECOGNITION / NONE)", async () => {
    (LocalAuthentication as any).__setMockCapabilities({
      hardware: true,
      enrolled: true,
      types: [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION],
    });
    expect(await biometricService.getBiometricType()).toBe("FACIAL_RECOGNITION");

    (LocalAuthentication as any).__setMockCapabilities({
      hardware: true,
      enrolled: true,
      types: [LocalAuthentication.AuthenticationType.FINGERPRINT],
    });
    expect(await biometricService.getBiometricType()).toBe("FINGERPRINT");

    (LocalAuthentication as any).__setMockCapabilities({
      hardware: false,
      enrolled: false,
      types: [],
    });
    expect(await biometricService.getBiometricType()).toBe("NONE");
  });

  it("returns success: true when authenticateAsync succeeds", async () => {
    (LocalAuthentication as any).__setMockAuthResult({ success: true });

    const result = await biometricService.authenticateUser("Inicia sesión en BasketApp");
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns success: false with error message when user cancels or recognition fails", async () => {
    (LocalAuthentication as any).__setMockAuthResult({
      success: false,
      error: "user_cancel",
    });

    const result = await biometricService.authenticateUser();
    expect(result.success).toBe(false);
    expect(result.error).toBe("user_cancel");
  });
});

