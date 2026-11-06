import { useAuthLifecycle } from "../../hooks/useAuthLifecycle";
import { useAuthStore } from "../../store/useAuthStore";

describe("useAuthLifecycle Hook (T016 [US2])", () => {
  beforeEach(() => {
    useAuthStore.getState().resetForm();
    useAuthStore.setState({
      status: "idle",
      token: null,
      user: null,
      expiresAt: null,
    });
    jest.clearAllMocks();
  });

  it("triggers checkSession on mount", () => {
    const checkSessionSpy = jest
      .spyOn(useAuthStore.getState(), "checkSession")
      .mockResolvedValue(true);

    let effectCallback: any = null;
    jest.spyOn(require("react"), "useEffect").mockImplementationOnce((effect: any) => {
      effectCallback = effect;
    });

    useAuthLifecycle();

    expect(effectCallback).toBeDefined();
    effectCallback();

    expect(checkSessionSpy).toHaveBeenCalled();
  });
});

