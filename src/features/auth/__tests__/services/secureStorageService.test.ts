import { secureStorageService } from "../../services/secureStorageService";
import * as SecureStore from "expo-secure-store";
import { RememberedCredentials } from "../../types";

describe("secureStorageService (US7, FR-020, FR-021, FR-024, SC-011)", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    if ((SecureStore as any).__resetMockStore) {
      (SecureStore as any).__resetMockStore();
    }
  });

  const mockCreds: RememberedCredentials = {
    username: "Patrick.JS",
    password: "secretPassword123",
    savedAt: "2026-11-06T10:00:00.000Z",
  };

  it("saves credentials and sets rememberMe flag to enabled", async () => {
    await secureStorageService.saveCredentials(mockCreds);

    const isEnabled = await secureStorageService.isRememberMeEnabled();
    expect(isEnabled).toBe(true);

    const retrieved = await secureStorageService.getCredentials();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.username).toBe("Patrick.JS");
    expect(retrieved?.password).toBe("secretPassword123");
    expect(retrieved?.savedAt).toBe("2026-11-06T10:00:00.000Z");
  });

  it("returns null when no credentials have been saved", async () => {
    const creds = await secureStorageService.getCredentials();
    expect(creds).toBeNull();

    const isEnabled = await secureStorageService.isRememberMeEnabled();
    expect(isEnabled).toBe(false);
  });

  it("clears credentials and disables remember me on clearCredentials", async () => {
    await secureStorageService.saveCredentials(mockCreds);
    await secureStorageService.clearCredentials();

    const creds = await secureStorageService.getCredentials();
    expect(creds).toBeNull();

    const isEnabled = await secureStorageService.isRememberMeEnabled();
    expect(isEnabled).toBe(false);
  });

  it("handles corrupted json payload safely by purging and returning null", async () => {
    await SecureStore.setItemAsync("bcm_remember_me_credentials", "{corrupted-not-json");

    const creds = await secureStorageService.getCredentials();
    expect(creds).toBeNull();
  });
});

