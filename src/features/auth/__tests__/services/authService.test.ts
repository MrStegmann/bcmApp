import { authService, AuthApiError, NetworkTimeoutError } from "../../services/authService";
import { env } from "../../../../core/config/env";
import { LoginRequestBody, LoginSuccessResponse } from "../../types";

declare const global: any;
declare const expect: any;
declare const jest: any;

describe("authService", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const validCredentials: LoginRequestBody = {
    username: "Patrick.JS",
    password: "securepassword123",
  };

  const mockSuccessResponse: LoginSuccessResponse = {
    token: "mock-jwt-token-xyz",
    tokenType: "Bearer",
    expiresIn: 86400,
    user: {
      id: 1,
      username: "Patrick.JS",
      status: "ACTIVE",
      createdAt: "2026-11-01T09:49:33.990499Z",
    },
  };

  it("resolves endpoint strictly from env.API_URI and sends POST /auth/login with credentials", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockSuccessResponse),
    } as unknown as Response);

    const result = await authService.login(validCredentials);

    expect(global.fetch).toHaveBeenCalledWith(
      `${env.API_URI}/auth/login`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validCredentials),
      })
    );

    expect(result).toEqual(mockSuccessResponse);
  });

  it("calculates absolute expiration ISO timestamp based on expiresIn seconds", () => {
    const fixedNow = 1700000000000;
    jest.spyOn(Date, "now").mockReturnValue(fixedNow);

    const expiresAt = authService.calculateExpiresAt(86400);
    const expected = new Date(fixedNow + 86400 * 1000).toISOString();

    expect(expiresAt).toBe(expected);

    jest.restoreAllMocks();
  });

  it("throws AuthApiError with user-friendly message on 401 Unauthorized", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: "Invalid credentials" }),
    } as unknown as Response);

    await expect(authService.login(validCredentials)).rejects.toThrow(AuthApiError);
    await expect(authService.login(validCredentials)).rejects.toThrow(
      "Credenciales inválidas. Por favor, revisa tu usuario y contraseña."
    );
  });

  it("throws AuthApiError on 500 internal server error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: "Internal server error" }),
    } as unknown as Response);

    await expect(authService.login(validCredentials)).rejects.toThrow(
      "Error del servidor. Por favor, inténtalo más tarde."
    );
  });

  it("throws NetworkTimeoutError on request abort/timeout", async () => {
    const abortError = new Error("The operation was aborted");
    abortError.name = "AbortError";
    global.fetch = jest.fn().mockRejectedValue(abortError);

    await expect(authService.login(validCredentials)).rejects.toThrow(NetworkTimeoutError);
    await expect(authService.login(validCredentials)).rejects.toThrow(
      "Error de conexión. Verifica tu conexión a internet o el estado del servidor."
    );
  });

  it("throws NetworkTimeoutError on generic fetch network failure", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(authService.login(validCredentials)).rejects.toThrow(NetworkTimeoutError);
  });
});
