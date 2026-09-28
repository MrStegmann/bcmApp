import { useMenuStore } from "../../store/MenuStore";
import { TopMenuEnums } from "../../types/enums";
import { BottomMenuItem } from "../../store/MenuStore";

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
