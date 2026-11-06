/**
 * Contract: Authentication API Endpoint
 * Endpoint: POST ${env.API_URI}/auth/login
 * Resolved strictly from centralized module: src/core/config/env.ts
 */

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface UserProfileDto {
  id: number;
  username: string;
  status: string;
  createdAt: string;
}

export interface LoginSuccessResponse {
  token: string;
  tokenType: string;
  expiresIn: number; // in seconds, e.g. 86400
  user: UserProfileDto;
}

export interface LoginErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface IAuthApiService {
  /**
   * Dispatches login request to ${env.API_URI}/auth/login
   * @throws NetworkError or ApiError on failure
   */
  login(credentials: LoginRequestBody): Promise<LoginSuccessResponse>;
}
