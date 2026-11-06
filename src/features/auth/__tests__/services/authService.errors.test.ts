import { authService, AuthApiError, NetworkTimeoutError } from "../../services/authService";
import { LoginRequestBody } from "../../types";

declare const global: any;
declare const expect: any;

describe("authService Error Classification (US5, FR-007, FR-008, SC-007)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const credentials: LoginRequestBody = {
    username: "user",
    password: "pass",
  };

  it("maps 401 Unauthorized to AuthApiError with actionable credential message", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: "Bad credentials" }),
    } as unknown as Response);

    await expect(authService.login(credentials)).rejects.toThrow(
      "Credenciales inválidas. Por favor, revisa tu usuario y contraseña."
    );
  });

  it("maps 500+ Internal Server Error to user-friendly server error message", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as Response);

    await expect(authService.login(credentials)).rejects.toThrow(
      "Error del servidor. Por favor, inténtalo más tarde."
    );
  });

  it("maps network disconnection / TypeError to NetworkTimeoutError with connectivity message", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(authService.login(credentials)).rejects.toThrow(
      "Error de conexión. Verifica tu conexión a internet o el estado del servidor."
    );
  });
});
