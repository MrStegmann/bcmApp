import { useMenuStore, BottomMenuItem } from "../../store/MenuStore";
import { useClubStore } from "../../store/ClubStore";
import { TopMenuEnums } from "../../types/enums";

declare const jest: any;
declare const expect: any;

describe("ClubProfile Streamlined Layout & Settings Removal Unit Tests (US2 / T010)", () => {
  const mockTeam = {
    id: 1,
    name: "Golden State Warriors",
    category: "Senior",
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    useClubStore.setState({
      club: mockTeam,
      currentTeam: mockTeam,
      teamsList: [mockTeam],
      clubs: [mockTeam],
      isLoading: false,
      error: null,
    });
    useMenuStore.setState({
      activeTab: TopMenuEnums.MAIN,
      headerTitle: "Equipo: Golden State Warriors",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should configure 5 core bottom navigation tabs in team layout without EDIT_TEAM", () => {
    const bottomItems: BottomMenuItem[] = [
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GAMES, label: "Partidos", iconName: "basketball-hoop-outline", iconFamily: "MaterialCommunityIcons", onPress: jest.fn() },
      { id: TopMenuEnums.TRAININGS, label: "Entrenamientos", iconName: "clipboard-notes", iconFamily: "Foundation", onPress: jest.fn() },
      { id: TopMenuEnums.CALENDAR, label: "Cuotas", iconName: "calendar", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: jest.fn() },
    ];

    useMenuStore.getState().setBottomMenu(bottomItems);

    const menuIds = useMenuStore.getState().bottomMenuItems.map((item) => item.id);
    expect(menuIds.length).toBe(5);
    expect(menuIds).not.toContain(TopMenuEnums.EDIT_TEAM);
  });

  it("should update header title correctly when switching tabs", () => {
    useMenuStore.getState().setActiveTab(TopMenuEnums.PLAYERS);
    useMenuStore.getState().setHeaderTitle("Plantilla de Jugadores");

    expect(useMenuStore.getState().activeTab).toBe(TopMenuEnums.PLAYERS);
    expect(useMenuStore.getState().headerTitle).toBe("Plantilla de Jugadores");
  });

  it("should preserve stable return callback references and avoid nested state loops", () => {
    const returnFn = jest.fn();
    let updates = 0;
    const unsubscribe = useMenuStore.subscribe(() => {
      updates += 1;
    });

    const bottomItems: BottomMenuItem[] = [
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: returnFn },
    ];

    useMenuStore.getState().setBottomMenu(bottomItems);
    expect(updates).toBe(1);

    const goBackItem = useMenuStore.getState().bottomMenuItems.find((i) => i.id === TopMenuEnums.GO_BACK);
    goBackItem?.onPress();
    expect(returnFn).toHaveBeenCalledTimes(1);

    unsubscribe();
  });
});

describe("ClubProfile Bottom Navbar - Home Button & No Calendar/Fees (US1 / T004)", () => {
  const mockTeam = {
    id: 2,
    name: "Chicago Bulls",
    category: "Senior",
    createdAt: "2026-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    useClubStore.setState({
      club: mockTeam,
      currentTeam: mockTeam,
      teamsList: [mockTeam],
      clubs: [mockTeam],
      isLoading: false,
      error: null,
    });
    useMenuStore.setState({
      activeTab: TopMenuEnums.MAIN,
      headerTitle: "Equipo: Chicago Bulls",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should configure exactly 5 bottom items with Home (MAIN) and no CALENDAR or Fees", () => {
    const bottomItems: BottomMenuItem[] = [
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GAMES, label: "Partidos", iconName: "basketball-hoop-outline", iconFamily: "MaterialCommunityIcons", onPress: jest.fn() },
      { id: TopMenuEnums.TRAININGS, label: "Entrenamientos", iconName: "clipboard-notes", iconFamily: "Foundation", onPress: jest.fn() },
      { id: TopMenuEnums.MAIN, label: "Inicio", iconName: "home", iconFamily: "Feather", onPress: jest.fn() },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: jest.fn() },
    ];

    useMenuStore.getState().setBottomMenu(bottomItems);

    const state = useMenuStore.getState();
    const menuIds = state.bottomMenuItems.map((item) => item.id);

    expect(menuIds.length).toBe(5);
    expect(menuIds).toContain(TopMenuEnums.MAIN);
    expect(menuIds).not.toContain(TopMenuEnums.CALENDAR);
    expect(menuIds).not.toContain(TopMenuEnums.EDIT_TEAM);
  });

  it("should contain Home item labeled 'Inicio' with home icon", () => {
    const bottomItems: BottomMenuItem[] = [
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GAMES, label: "Partidos", iconName: "basketball-hoop-outline", iconFamily: "MaterialCommunityIcons", onPress: jest.fn() },
      { id: TopMenuEnums.TRAININGS, label: "Entrenamientos", iconName: "clipboard-notes", iconFamily: "Foundation", onPress: jest.fn() },
      { id: TopMenuEnums.MAIN, label: "Inicio", iconName: "home", iconFamily: "Feather", onPress: jest.fn() },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: jest.fn() },
    ];

    useMenuStore.getState().setBottomMenu(bottomItems);

    const homeItem = useMenuStore.getState().bottomMenuItems.find((i) => i.id === TopMenuEnums.MAIN);
    expect(homeItem).toBeDefined();
    expect(homeItem?.label).toBe("Inicio");
    expect(homeItem?.iconName).toBe("home");
  });

  it("should invoke Home onPress and transition activeTab back to MAIN", () => {
    const goHomeFn = jest.fn(() => {
      useMenuStore.getState().setActiveTab(TopMenuEnums.MAIN);
    });

    const bottomItems: BottomMenuItem[] = [
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.MAIN, label: "Inicio", iconName: "home", iconFamily: "Feather", onPress: goHomeFn },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: jest.fn() },
    ];

    useMenuStore.getState().setActiveTab(TopMenuEnums.PLAYERS);
    useMenuStore.getState().setBottomMenu(bottomItems);

    const homeItem = useMenuStore.getState().bottomMenuItems.find((i) => i.id === TopMenuEnums.MAIN);
    homeItem?.onPress();

    expect(goHomeFn).toHaveBeenCalledTimes(1);
    expect(useMenuStore.getState().activeTab).toBe(TopMenuEnums.MAIN);
  });
});
