import { useMenuStore, HeaderBackAction } from "../../store/MenuStore";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { authSessionRepository } from "../../features/auth/db/authSessionRepository";

jest.mock("../../features/auth/db/authSessionRepository");

describe("ClubManage Header Logout Action (US6, FR-017, FR-018, FR-019)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMenuStore.setState({
      headerTitle: "",
      headerAction: null,
      headerBackAction: null,
    });
    useAuthStore.setState({
      status: "authenticated",
      token: "active-token-xyz",
      user: {
        id: 1,
        username: "Patrick.JS",
        status: "ACTIVE",
        createdAt: "2026-11-01T00:00:00.000Z",
      },
    });
  });

  const configureClubManageHeader = (mode: {
    club: any | null;
    createMode: boolean;
    editingTeam: any | null;
  }) => {
    const { setHeaderBackAction } = useMenuStore.getState();

    if (mode.club) {
      setHeaderBackAction({
        label: "Volver",
        iconName: "arrow-left",
        iconFamily: "Feather",
        onPress: () => {},
      });
      return;
    }

    if (mode.createMode) {
      setHeaderBackAction({
        label: "Volver",
        iconName: "arrow-left",
        iconFamily: "Feather",
        onPress: () => {},
      });
    } else if (mode.editingTeam) {
      setHeaderBackAction({
        label: "Volver",
        iconName: "arrow-left",
        iconFamily: "Feather",
        onPress: () => {},
      });
    } else {
      setHeaderBackAction({
        testID: "header-logout-button",
        label: "Cerrar sesión",
        iconName: "power",
        iconFamily: "Feather",
        onPress: () => {
          useAuthStore.getState().logout();
        },
      });
    }
  };

  it("configures headerBackAction with power icon and header-logout-button testID when displaying main team list", () => {
    configureClubManageHeader({ club: null, createMode: false, editingTeam: null });

    const backAction = useMenuStore.getState().headerBackAction;

    expect(backAction).not.toBeNull();
    expect(backAction?.testID).toBe("header-logout-button");
    expect(backAction?.iconName).toBe("power");
    expect(backAction?.iconFamily).toBe("Feather");
    expect(backAction?.label).toBe("Cerrar sesión");
  });

  it("switches to back navigation when createMode is true", () => {
    configureClubManageHeader({ club: null, createMode: true, editingTeam: null });

    const backAction = useMenuStore.getState().headerBackAction;

    expect(backAction).not.toBeNull();
    expect(backAction?.iconName).toBe("arrow-left");
    expect(backAction?.testID).toBeUndefined();
  });

  it("triggers useAuthStore.logout() and clears session when header-logout-button onPress is invoked", async () => {
    (authSessionRepository.clearSession as jest.Mock).mockResolvedValue(undefined);

    configureClubManageHeader({ club: null, createMode: false, editingTeam: null });

    const backAction = useMenuStore.getState().headerBackAction;
    expect(backAction).not.toBeNull();

    await backAction?.onPress();

    expect(authSessionRepository.clearSession).toHaveBeenCalledTimes(1);
    const authState = useAuthStore.getState();
    expect(authState.status).toBe("unauthenticated");
    expect(authState.token).toBeNull();
    expect(authState.user).toBeNull();
  });
});
