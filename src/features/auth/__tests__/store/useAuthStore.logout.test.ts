import { useAuthStore } from "../../store/useAuthStore";
import { authSessionRepository } from "../../db/authSessionRepository";

declare const expect: any;

jest.mock("../../db/authSessionRepository");

describe("useAuthStore - Logout (US6, FR-017, FR-018)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      status: "authenticated",
      token: "valid-session-token",
      user: {
        id: 1,
        username: "Patrick.JS",
        status: "ACTIVE",
        createdAt: "2026-11-01T00:00:00.000Z",
      },
      expiresAt: "2026-11-10T00:00:00.000Z",
      usernameInput: "Patrick.JS",
      passwordInput: "secret",
      validationError: { username: "err" },
      apiError: "some error",
    });
  });

  it("purges SQLite session cache and resets store state to unauthenticated", async () => {
    (authSessionRepository.clearSession as jest.Mock).mockResolvedValue(undefined);

    await useAuthStore.getState().logout();

    expect(authSessionRepository.clearSession).toHaveBeenCalledTimes(1);

    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.expiresAt).toBeNull();
    expect(state.passwordInput).toBe("");
    expect(state.validationError).toBeNull();
    expect(state.apiError).toBeNull();
  });

  it("handles repository failure gracefully without throwing and still clears in-memory state", async () => {
    (authSessionRepository.clearSession as jest.Mock).mockRejectedValue(new Error("Disk error"));

    await expect(useAuthStore.getState().logout()).resolves.toBeUndefined();

    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});
