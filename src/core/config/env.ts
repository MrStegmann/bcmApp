export interface EnvConfig {
  API_URI: string;
  isProduction: boolean;
}

const DEFAULT_API_URI = "http://10.0.2.2:8080/api/v1";

function sanitizeUrl(url?: string): string {
  if (!url || typeof url !== "string") {
    return DEFAULT_API_URI;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return DEFAULT_API_URI;
  }
  return trimmed.replace(/\/+$/, "");
}

export function getEnvConfig(): EnvConfig {
  const envObj: Record<string, string | undefined> =
    typeof process !== "undefined" && process.env
      ? (process.env as Record<string, string | undefined>)
      : {};

  const rawApiUri =
    envObj["EXPO_PUBLIC_API_URI"] ||
    envObj["API_URI"] ||
    DEFAULT_API_URI;

  const isProduction = envObj["NODE_ENV"] === "production";

  return {
    API_URI: sanitizeUrl(rawApiUri),
    isProduction,
  };
}

export const env: EnvConfig = getEnvConfig();
