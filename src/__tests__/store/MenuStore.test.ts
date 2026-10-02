import { useMenuStore, HeaderAction } from "../../store/MenuStore";
import { TopMenuEnums } from "../../types/enums";

declare const jest: any;
declare const expect: any;

describe("MenuStore Unit Tests (T005)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.MAIN,
      headerTitle: "Gestión de Equipos",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should initialize with default state", () => {
    const state = useMenuStore.getState();
    expect(state.activeTab).toBe(TopMenuEnums.MAIN);
    expect(state.headerTitle).toBe("Gestión de Equipos");
    expect(state.bottomMenuItems).toEqual([]);
    expect(state.headerAction).toBeNull();
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

describe("MenuStore headerAction State Transitions (T003)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.MAIN,
      headerTitle: "Gestión de Equipos",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should initialize headerAction as null", () => {
    expect(useMenuStore.getState().headerAction).toBeNull();
  });

  it("should set a headerAction when setHeaderAction is called with a valid action", () => {
    const mockAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: jest.fn(),
    };

    useMenuStore.getState().setHeaderAction(mockAction);
    const action = useMenuStore.getState().headerAction;

    expect(action).not.toBeNull();
    expect(action?.label).toBe("Añadir");
    expect(action?.iconName).toBe("plus-circle");
    expect(action?.iconFamily).toBe("Feather");
  });

  it("should clear headerAction when setHeaderAction is called with null", () => {
    const mockAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      onPress: jest.fn(),
    };

    useMenuStore.getState().setHeaderAction(mockAction);
    expect(useMenuStore.getState().headerAction).not.toBeNull();

    useMenuStore.getState().setHeaderAction(null);
    expect(useMenuStore.getState().headerAction).toBeNull();
  });

  it("should replace an existing headerAction when a new one is set", () => {
    const firstAction: HeaderAction = {
      label: "Añadir Jugador",
      iconName: "user-plus",
      iconFamily: "Feather",
      onPress: jest.fn(),
    };
    const secondAction: HeaderAction = {
      label: "Añadir Partido",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: jest.fn(),
    };

    useMenuStore.getState().setHeaderAction(firstAction);
    expect(useMenuStore.getState().headerAction?.label).toBe("Añadir Jugador");

    useMenuStore.getState().setHeaderAction(secondAction);
    expect(useMenuStore.getState().headerAction?.label).toBe("Añadir Partido");
  });

  it("should invoke onPress callback from headerAction correctly", () => {
    const onPressMock = jest.fn();
    const mockAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus",
      onPress: onPressMock,
    };

    useMenuStore.getState().setHeaderAction(mockAction);
    useMenuStore.getState().headerAction?.onPress();

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});

describe("MenuStore headerBackAction State Transitions (T008)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.MAIN,
      headerTitle: "Gestión de Equipos",
      headerAction: null,
      headerBackAction: null,
      bottomMenuItems: [],
    });
  });

  it("should initialize headerBackAction as null", () => {
    expect(useMenuStore.getState().headerBackAction).toBeNull();
  });

  it("should set a headerBackAction when setHeaderBackAction is called with a valid action", () => {
    const onPressMock = jest.fn();
    const mockBackAction = {
      label: "Volver",
      iconName: "chevron-left",
      iconFamily: "Feather" as const,
      onPress: onPressMock,
      testID: "header-back-button",
    };

    useMenuStore.getState().setHeaderBackAction(mockBackAction);
    const action = useMenuStore.getState().headerBackAction;

    expect(action).not.toBeNull();
    expect(action?.label).toBe("Volver");
    expect(action?.iconName).toBe("chevron-left");
    expect(action?.iconFamily).toBe("Feather");
    expect(action?.testID).toBe("header-back-button");

    action?.onPress();
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("should clear headerBackAction when setHeaderBackAction is called with null", () => {
    const mockBackAction = {
      label: "Volver",
      onPress: jest.fn(),
    };

    useMenuStore.getState().setHeaderBackAction(mockBackAction);
    expect(useMenuStore.getState().headerBackAction).not.toBeNull();

    useMenuStore.getState().setHeaderBackAction(null);
    expect(useMenuStore.getState().headerBackAction).toBeNull();
  });
});

describe("Routing Performance Unit Tests (US3 / T012)", () => {
  it("should execute 100 rapid tab state transitions in under 100ms", () => {
    const tabs = [
      TopMenuEnums.PLAYERS,
      TopMenuEnums.GAMES,
      TopMenuEnums.TRAININGS,
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

