/**
 * Contract: Centralized Environment Configuration Module
 * Location: src/core/config/env.ts
 */

export interface EnvConfig {
  /**
   * Base URL for the backend API and authentication endpoints.
   * Trailing slashes are stripped to avoid malformed path concatenation.
   * Example: 'http://localhost:3000' or 'https://api.bcm.app'
   */
  API_URI: string;

  /**
   * Boolean flag indicating whether the app is running in production mode.
   */
  isProduction: boolean;
}

export interface IEnvConfigProvider {
  /**
   * Read and sanitize the environment configuration.
   * Resolves EXPO_PUBLIC_API_URI, API_URI, or defaults to fallback in development.
   */
  getEnvConfig(): EnvConfig;
}

