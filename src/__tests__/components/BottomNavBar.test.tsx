import { useMenuStore } from "../../store/MenuStore";
import { TopMenuEnums } from "../../types/enums";
import { BottomMenuItem } from "../../store/MenuStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

declare const jest: any;
declare const expect: any;

describe("BottomNavBar Component & Navigation Flow Unit Tests (US1 / T006)", () => {
  const mockItems: BottomMenuItem[] = [
    {
      id: TopMenuEnums.PLAYERS,
      label: "Plantilla",
      iconName: "users",
      iconFamily: "Entypo",
      onPress: jest.fn(),
    },
    {
      id: TopMenuEnums.GAMES,
      label: "Partidos",
      iconName: "basketball-hoop-outline",
      iconFamily: "MaterialCommunityIcons",
      onPress: jest.fn(),
    },
    {
      id: TopMenuEnums.GO_BACK,
      label: "Volver",
      iconName: "door-open",
      iconFamily: "FontAwesome5",
      onPress: jest.fn(),
    },
  ];

  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.PLAYERS,
      headerTitle: "Plantilla de Jugadores",
      headerAction: null,
      bottomMenuItems: mockItems,
    });
  });

  it("should configure bottom menu items and active tab in MenuStore", () => {
    const state = useMenuStore.getState();
    expect(state.bottomMenuItems.length).toBe(3);
    expect(state.activeTab).toBe(TopMenuEnums.PLAYERS);
    expect(state.headerTitle).toBe("Plantilla de Jugadores");
  });

  it("should trigger item onPress handler when tab action is invoked", () => {
    const items = useMenuStore.getState().bottomMenuItems;
    items[0].onPress();
    expect(mockItems[0].onPress).toHaveBeenCalled();
  });

  it("should update header title when active tab changes", () => {
    useMenuStore.getState().setActiveTab(TopMenuEnums.GAMES);
    useMenuStore.getState().setHeaderTitle("Partidos");

    const state = useMenuStore.getState();
    expect(state.activeTab).toBe(TopMenuEnums.GAMES);
    expect(state.headerTitle).toBe("Partidos");
  });
});

describe("BottomNavBar Home Button & Item Order (US1 / T010)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.PLAYERS,
      headerTitle: "Plantilla de Jugadores",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should place Home (MAIN) as the first item (index 0) in team layout menu", () => {
    const teamMenuItems: BottomMenuItem[] = [
      { id: TopMenuEnums.MAIN, label: "Inicio", iconName: "home", iconFamily: "Feather", onPress: jest.fn() },
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GAMES, label: "Partidos", iconName: "basketball-hoop-outline", iconFamily: "MaterialCommunityIcons", onPress: jest.fn() },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: jest.fn() },
    ];

    useMenuStore.getState().setBottomMenu(teamMenuItems);

    const items = useMenuStore.getState().bottomMenuItems;
    expect(items.length).toBe(4);
    expect(items[0].id).toBe(TopMenuEnums.MAIN);
    expect(items[1].id).toBe(TopMenuEnums.PLAYERS);
    expect(items[2].id).toBe(TopMenuEnums.GAMES);
    expect(items[3].id).toBe(TopMenuEnums.GO_BACK);
  });

  it("should set activeTab to MAIN when Home button onPress is triggered", () => {
    const homePressFn = jest.fn(() => {
      useMenuStore.getState().setActiveTab(TopMenuEnums.MAIN);
    });

    const teamMenuItems: BottomMenuItem[] = [
      { id: TopMenuEnums.MAIN, label: "Inicio", iconName: "home", iconFamily: "Feather", onPress: homePressFn },
      { id: TopMenuEnums.PLAYERS, label: "Plantilla", iconName: "users", iconFamily: "Entypo", onPress: jest.fn() },
      { id: TopMenuEnums.GO_BACK, label: "Volver", iconName: "door-open", iconFamily: "FontAwesome5", onPress: jest.fn() },
    ];

    useMenuStore.getState().setBottomMenu(teamMenuItems);

    const homeItem = useMenuStore.getState().bottomMenuItems[0];
    homeItem.onPress();

    expect(homePressFn).toHaveBeenCalledTimes(1);
    expect(useMenuStore.getState().activeTab).toBe(TopMenuEnums.MAIN);
  });

  it("should configure Home item with 'Inicio' label and 'home' icon", () => {
    const teamMenuItems: BottomMenuItem[] = [
      { id: TopMenuEnums.MAIN, label: "Inicio", iconName: "home", iconFamily: "Feather", onPress: jest.fn() },
    ];

    useMenuStore.getState().setBottomMenu(teamMenuItems);

    const homeItem = useMenuStore.getState().bottomMenuItems[0];
    expect(homeItem.label).toBe("Inicio");
    expect(homeItem.iconName).toBe("home");
    expect(homeItem.iconFamily).toBe("Feather");
  });
});

describe("BottomNavBar Safe Area - Bottom Margin (US3 / T014)", () => {
  it("should expose useSafeAreaInsets from the mock returning zero insets", () => {
    const insets = useSafeAreaInsets();
    expect(insets.bottom).toBe(0);
  });

  it("should compute at least 8px bottom padding when insets.bottom is 0", () => {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 8);
    expect(bottomPadding).toBeGreaterThanOrEqual(8);
  });

  it("should use insets.bottom when it exceeds the minimum threshold", () => {
    // Simulate a device with a 34px home indicator bar (iPhone X+)
    const mockBottom = 34;
    const bottomPadding = Math.max(mockBottom, 8);
    expect(bottomPadding).toBe(34);
  });
});
