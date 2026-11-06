import { env } from "../../../core/config/env";
import { LoginRequestBody, LoginSuccessResponse } from "../types";

export class AuthApiError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = statusCode;
  }
}

export class NetworkTimeoutError extends Error {
  constructor(message: string = "Error de conexión. Verifica tu conexión a internet o el estado del servidor.") {
    super(message);
    this.name = "NetworkTimeoutError";
  }
}

export interface IAuthApiService {
  login(credentials: LoginRequestBody): Promise<LoginSuccessResponse>;
  calculateExpiresAt(expiresInSeconds: number): string;
}

export const authService: IAuthApiService = {
  calculateExpiresAt(expiresInSeconds: number): string {
    return new Date(Date.now() + expiresInSeconds * 1000).toISOString();
  },

  async login(credentials: LoginRequestBody): Promise<LoginSuccessResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const targetUrl = `${env.API_URI}/auth/login`;
    console.log(targetUrl)

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new AuthApiError(
            "Credenciales inválidas. Por favor, revisa tu usuario y contraseña.",
            401
          );
        }
        if (response.status >= 500) {
          throw new AuthApiError(
            "Error del servidor. Por favor, inténtalo más tarde.",
            response.status
          );
        }
        let serverMessage = "Error en la autenticación.";
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            serverMessage = errData.message;
          }
        } catch { }
        throw new AuthApiError(serverMessage, response.status);
      }

      const data = (await response.json()) as LoginSuccessResponse;
      return data;
    } catch (error: any) {
      console.log(error);
      if (error instanceof AuthApiError) {
        throw error;
      }
      if (error && (error.name === "AbortError" || error instanceof TypeError)) {
        throw new NetworkTimeoutError();
      }
      throw new NetworkTimeoutError(error?.message || "Error de red desconocido");
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

