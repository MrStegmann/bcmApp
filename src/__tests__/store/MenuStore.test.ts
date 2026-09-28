import { useMenuStore } from "../../store/MenuStore";
import { TopMenuEnums } from "../../types/enums";

declare const jest: any;
declare const expect: any;

describe("MenuStore Unit Tests (T005)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.MAIN,
      headerTitle: "Gestión de Equipos",
      bottomMenuItems: [],
    });
  });

  it("should initialize with default state", () => {
    const state = useMenuStore.getState();
    expect(state.activeTab).toBe(TopMenuEnums.MAIN);
    expect(state.headerTitle).toBe("Gestión de Equipos");
    expect(state.bottomMenuItems).toEqual([]);
  });

  it("should update headerTitle when setHeaderTitle is called", () => {
    useMenuStore.getState().setHeaderTitle("Plantilla de Jugadores");
    expect(useMenuStore.getState().headerTitle).toBe("Plantilla de Jugadores");
  });

  it("should update activeTab when setActiveTab is called", () => {
    useMenuStore.getState().setActiveTab(TopMenuEnums.PLAYERS);
    expect(useMenuStore.getState().activeTab).toBe(TopMenuEnums.PLAYERS);
  });

  it("should update bottomMenuItems when setBottomMenu is called", () => {
    const mockItems = [
      {
        id: TopMenuEnums.PLAYERS,
        label: "Plantilla",
        iconName: "users",
        onPress: jest.fn(),
      },
    ];

    useMenuStore.getState().setBottomMenu(mockItems);
    expect(useMenuStore.getState().bottomMenuItems).toEqual(mockItems);
  });
});

describe("Routing Performance Unit Tests (US3 / T012)", () => {
  it("should execute 100 rapid tab state transitions in under 100ms", () => {
    const tabs = [
      TopMenuEnums.PLAYERS,
      TopMenuEnums.GAMES,
      TopMenuEnums.TRAININGS,
      TopMenuEnums.CALENDAR,
      TopMenuEnums.MAIN,
    ];

    const startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      const targetTab = tabs[i % tabs.length];
      useMenuStore.getState().setActiveTab(targetTab);
      useMenuStore.getState().setHeaderTitle(`View ${i}`);
    }
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(100);
    expect(useMenuStore.getState().activeTab).toBe(TopMenuEnums.MAIN);
  });
});
