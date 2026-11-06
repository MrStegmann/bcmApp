import { useAuthStore } from "../../store/useAuthStore";
import { authSessionRepository } from "../../db/authSessionRepository";

jest.mock("../../db/authSessionRepository");

describe("useAuthStore - Session Check & Restoration (US2)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      status: "idle",
      token: null,
      user: null,
      expiresAt: null,
    });
  });

  it("restores authenticated state on launch when cached session is valid", async () => {
    (authSessionRepository.getActiveSession as jest.Mock).mockResolvedValue({
      id: 1,
      token: "valid-cached-token-123",
      tokenType: "Bearer",
      expiresIn: 7200,
      expiresAt: "2026-11-10T12:00:00.000Z",
      userId: 10,
      username: "Patrick.JS",
      userStatus: "ACTIVE",
      userCreatedAt: "2026-11-01T00:00:00.000Z",
    });
    (authSessionRepository.isSessionValid as jest.Mock).mockReturnValue(true);

    const result = await useAuthStore.getState().checkSession();

    expect(result).toBe(true);
    const state = useAuthStore.getState();
    expect(state.status).toBe("authenticated");
    expect(state.token).toBe("valid-cached-token-123");
    expect(state.user).toEqual({
      id: 10,
      username: "Patrick.JS",
      status: "ACTIVE",
      createdAt: "2026-11-01T00:00:00.000Z",
    });
    expect(state.expiresAt).toBe("2026-11-10T12:00:00.000Z");
  });

  it("transitions to unauthenticated and clears session when no active session exists", async () => {
    (authSessionRepository.getActiveSession as jest.Mock).mockResolvedValue(null);

    const result = await useAuthStore.getState().checkSession();

    expect(result).toBe(false);
    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });
});

