import { getEnvConfig } from "../env";

describe("Environment Configuration (src/core/config/env)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should default API_URI to http://localhost:3000 when no env vars are defined", () => {
    delete process.env.EXPO_PUBLIC_API_URI;
    delete process.env.API_URI;

    const config = getEnvConfig();
    expect(config.API_URI).toBe("http://localhost:3000");
    expect(config.isProduction).toBe(false);
  });

  it("should resolve API_URI from EXPO_PUBLIC_API_URI and strip trailing slashes", () => {
    process.env.EXPO_PUBLIC_API_URI = "https://api.bcm.app/v1/";
    delete process.env.API_URI;

    const config = getEnvConfig();
    expect(config.API_URI).toBe("https://api.bcm.app/v1");
  });

  it("should fallback to API_URI if EXPO_PUBLIC_API_URI is not set", () => {
    delete process.env.EXPO_PUBLIC_API_URI;
    process.env.API_URI = "http://192.168.1.100:3000///";

    const config = getEnvConfig();
    expect(config.API_URI).toBe("http://192.168.1.100:3000");
  });

  it("should correctly identify production mode", () => {
    process.env.NODE_ENV = "production";

    const config = getEnvConfig();
    expect(config.isProduction).toBe(true);
  });
});

