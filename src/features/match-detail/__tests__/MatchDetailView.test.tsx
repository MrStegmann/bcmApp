import { useMatchDetailStore } from "../store/useMatchDetailStore";
import { useMenuStore } from "../../../store/MenuStore";
import { Game } from "../../../types/database";
import { MatchEditBuffer } from "../types";

declare const jest: any;

describe("MatchDetailView Integration Tests (T030 - US1/US2/US3/US4)", () => {
  const mockMatch: Game = {
    id: 99,
    teamId: 1,
    opponent: "Joventut Badalona",
    round: "Jornada 12",
    date: "22/10/2026 - 19:00",
    status: "finished",
    createdAt: "2026-10-22T10:00:00.000Z",
    resultC1: 22,
    resultC2: 20,
    resultC3: 18,
    resultC4: 25,
    resultExtra: 0,
    resultC1Opponent: 18,
    resultC2Opponent: 22,
    resultC3Opponent: 19,
    resultC4Opponent: 21,
    resultExtraOpponent: 0,
    foulsC1: 4,
    foulsC2: 5,
    foulsC3: 3,
    foulsC4: 4,
    foulsExtra: 0,
    foulsC1Opponent: 3,
    foulsC2Opponent: 4,
    foulsC3Opponent: 5,
    foulsC4Opponent: 4,
    foulsExtraOpponent: 0,
  };

  beforeEach(() => {
    useMatchDetailStore.setState({
      match: null,
      teamName: "CB Cornellà",
      periods: [],
      players: [],
      advancedStats: {
        posesiones: 0,
        oer: 0,
        der: 0,
        efg: 0,
        orb: 0,
        ast: 0,
        tov: 0,
        ftr: 0,
      },
      selectedPlayer: null,
      isEditModalOpen: false,
      isLoading: false,
      isSaving: false,
      error: null,
    });
  });

  it("should perform full match initialization with periods, score calculations, and advanced stats", async () => {
    await useMatchDetailStore.getState().initializeMatch(mockMatch);

    const state = useMatchDetailStore.getState();
    expect(state.match?.id).toBe(99);
    expect(state.periods).toHaveLength(4);

    const totalTeamScore = state.periods.reduce((acc, p) => acc + p.teamPoints, 0);
    const totalRivalScore = state.periods.reduce((acc, p) => acc + p.rivalPoints, 0);
    expect(totalTeamScore).toBe(85);
    expect(totalRivalScore).toBe(80);

    const totalTeamFouls = state.periods.reduce((acc, p) => acc + p.teamFouls, 0);
    const totalRivalFouls = state.periods.reduce((acc, p) => acc + p.rivalFouls, 0);
    expect(totalTeamFouls).toBe(16);
    expect(totalRivalFouls).toBe(16);
  });

  it("should open and close edit modal state", () => {
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(false);

    useMatchDetailStore.getState().openEditModal();
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(true);

    useMatchDetailStore.getState().closeEditModal();
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(false);
  });

  it("should handle saving match edits and update local state seamlessly", async () => {
    await useMatchDetailStore.getState().initializeMatch(mockMatch);

    const editBuffer: MatchEditBuffer = {
      periods: {
        q1: { teamPoints: 25, teamFouls: 3, rivalPoints: 18, rivalFouls: 3 },
        q2: { teamPoints: 20, teamFouls: 5, rivalPoints: 22, rivalFouls: 4 },
        q3: { teamPoints: 18, teamFouls: 3, rivalPoints: 19, rivalFouls: 5 },
        q4: { teamPoints: 25, teamFouls: 4, rivalPoints: 21, rivalFouls: 4 },
        extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      },
      players: {},
    };

    await useMatchDetailStore.getState().saveMatchEdits(editBuffer);

    const state = useMatchDetailStore.getState();
    expect(state.isEditModalOpen).toBe(false);
    expect(state.isSaving).toBe(false);
  });

  it("should configure application shared header title and actions on mount and clear on unmount", () => {
    const onReturnMock = jest.fn();
    const openEditModal = useMatchDetailStore.getState().openEditModal;

    // Simulate header binding hook in MatchDetailView
    useMenuStore.getState().setMatchHeaderInfo(null);
    useMenuStore.getState().setHeaderTitle("Detalles del Partido");
    useMenuStore.getState().setHeaderBackAction({
      label: "Volver",
      iconName: "arrow-left",
      iconFamily: "Feather",
      onPress: onReturnMock,
      testID: "header-back-button",
    });
    useMenuStore.getState().setHeaderAction({
      label: "Editar",
      iconName: "edit-2",
      iconFamily: "Feather",
      onPress: openEditModal,
      testID: "header-action-button",
    });

    const menuState = useMenuStore.getState();
    expect(menuState.headerTitle).toBe("Detalles del Partido");
    expect(menuState.matchHeaderInfo).toBeNull();
    expect(menuState.headerBackAction?.label).toBe("Volver");
    expect(menuState.headerBackAction?.testID).toBe("header-back-button");
    expect(menuState.headerAction?.label).toBe("Editar");
    expect(menuState.headerAction?.testID).toBe("header-action-button");

    // Test back action invocation
    menuState.headerBackAction?.onPress();
    expect(onReturnMock).toHaveBeenCalledTimes(1);

    // Test edit action invocation
    menuState.headerAction?.onPress();
    expect(useMatchDetailStore.getState().isEditModalOpen).toBe(true);

    // Simulate unmount cleanup
    useMenuStore.getState().setMatchHeaderInfo(null);
    useMenuStore.getState().setHeaderTitle("Partidos");
    useMenuStore.getState().setHeaderAction(null);
    useMenuStore.getState().setHeaderBackAction(null);

    const cleanedMenuState = useMenuStore.getState();
    expect(cleanedMenuState.headerTitle).toBe("Partidos");
    expect(cleanedMenuState.headerBackAction).toBeNull();
    expect(cleanedMenuState.headerAction).toBeNull();
  });
});
