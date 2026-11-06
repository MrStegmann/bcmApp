import { useAuthStore } from "../../store/useAuthStore";
import { authSessionRepository } from "../../db/authSessionRepository";

jest.mock("../../db/authSessionRepository");

describe("useAuthLifecycle - Launch with Expired Cache (US4, FR-006, SC-006)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      status: "idle",
      token: null,
      user: null,
      expiresAt: null,
    });
  });

  it("purges expired session and sets store status to unauthenticated on app check", async () => {
    (authSessionRepository.getActiveSession as jest.Mock).mockResolvedValue({
      id: 1,
      token: "expired-token-xyz",
      tokenType: "Bearer",
      expiresIn: 3600,
      expiresAt: new Date(Date.now() - 50000).toISOString(),
      userId: 42,
      username: "OldUser",
      userStatus: "ACTIVE",
      userCreatedAt: "2026-01-01T00:00:00Z",
    });
    (authSessionRepository.isSessionValid as jest.Mock).mockReturnValue(false);
    (authSessionRepository.clearSession as jest.Mock).mockResolvedValue(undefined);

    const checkResult = await useAuthStore.getState().checkSession();

    expect(checkResult).toBe(false);
    expect(authSessionRepository.clearSession).toHaveBeenCalledTimes(1);

    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.expiresAt).toBeNull();
  });
});

