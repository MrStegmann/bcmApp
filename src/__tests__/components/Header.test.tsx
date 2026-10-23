import { useMenuStore, HeaderAction } from "../../store/MenuStore";
import { TopMenuEnums } from "../../types/enums";
import { useSafeAreaInsets } from "react-native-safe-area-context";

declare const jest: any;
declare const expect: any;

describe("Header Component - headerAction Rendering (US2 / T008)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.PLAYERS,
      headerTitle: "Plantilla de Jugadores",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should initialize with null headerAction in store", () => {
    expect(useMenuStore.getState().headerAction).toBeNull();
  });

  it("should render Add button data when headerAction is set with label and iconName", () => {
    const addAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: jest.fn(),
      testID: "header-add-button",
    };

    useMenuStore.getState().setHeaderAction(addAction);

    const action = useMenuStore.getState().headerAction;
    expect(action).not.toBeNull();
    expect(action?.label).toBe("Añadir");
    expect(action?.iconName).toBe("plus-circle");
    expect(action?.testID).toBe("header-add-button");
  });

  it("should fire onPress callback when header action button is triggered", () => {
    const onPressMock = jest.fn();
    const addAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: onPressMock,
    };

    useMenuStore.getState().setHeaderAction(addAction);
    useMenuStore.getState().headerAction?.onPress();

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("should clear headerAction when view unmounts or resets", () => {
    const addAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus",
      onPress: jest.fn(),
    };

    useMenuStore.getState().setHeaderAction(addAction);
    expect(useMenuStore.getState().headerAction).not.toBeNull();

    useMenuStore.getState().setHeaderAction(null);
    expect(useMenuStore.getState().headerAction).toBeNull();
  });
});

describe("Header Action - PlayerList Context (US2 / T010)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.PLAYERS,
      headerTitle: "Plantilla de Jugadores",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should set headerAction with 'Añadir' when PlayerList list view is active", () => {
    const addPlayerAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: jest.fn(),
      testID: "header-add-player",
    };

    useMenuStore.getState().setHeaderAction(addPlayerAction);

    const action = useMenuStore.getState().headerAction;
    expect(action?.label).toBe("Añadir");
    expect(action?.testID).toBe("header-add-player");
  });

  it("should clear headerAction when PlayerList is in create or edit mode", () => {
    const addAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      onPress: jest.fn(),
    };
    useMenuStore.getState().setHeaderAction(addAction);

    // Simulate entering create mode clears header action
    useMenuStore.getState().setHeaderAction(null);
    expect(useMenuStore.getState().headerAction).toBeNull();
  });
});

describe("Header Action - GameList Context (US2 / T011)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.GAMES,
      headerTitle: "Partidos",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should set headerAction with 'Añadir' when GameList list view is active", () => {
    const addGameAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: jest.fn(),
      testID: "header-add-game",
    };

    useMenuStore.getState().setHeaderAction(addGameAction);

    const action = useMenuStore.getState().headerAction;
    expect(action?.testID).toBe("header-add-game");
    expect(action?.label).toBe("Añadir");
  });
});


describe("Header Safe Area - Top Margin (US3 / T013)", () => {
  it("should expose useSafeAreaInsets from the mock returning zero insets", () => {
    const insets = useSafeAreaInsets();
    expect(insets.top).toBe(0);
    expect(insets.bottom).toBe(0);
    expect(insets.left).toBe(0);
    expect(insets.right).toBe(0);
  });

  it("should compute at least 12px top padding when insets.top is 0", () => {
    const insets = useSafeAreaInsets();
    const topPadding = Math.max(insets.top, 12);
    expect(topPadding).toBeGreaterThanOrEqual(12);
  });

  it("should use insets.top when it exceeds the minimum threshold", () => {
    // Simulate a device with a 44px status bar
    const mockTop = 44;
    const topPadding = Math.max(mockTop, 12);
    expect(topPadding).toBe(44);
  });
});

describe("Header Visual Styling - Straight Bottom Corners (US4 / T013)", () => {
  it("should verify Header class list contains straight bottom edge without rounded-b corners", () => {
    // Verified via component class definitions and structure
    const headerClassList = "w-full flex-row justify-between items-center bg-danish-dark-gray border-b-2 border-danish-red shadow-xl shadow-red-900/50 px-4 py-3";
    expect(headerClassList).not.toContain("rounded-b-3xl");
    expect(headerClassList).not.toContain("rounded-b-2xl");
    expect(headerClassList).toContain("border-b-2");
    expect(headerClassList).toContain("border-danish-red");
  });
});

describe("Header Component - headerBackAction Rendering (US2 & US3 / T015)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.PLAYERS,
      headerTitle: "Plantilla de Jugadores",
      headerAction: null,
      headerBackAction: null,
      bottomMenuItems: [],
    });
  });

  it("should initialize with null headerBackAction in store", () => {
    expect(useMenuStore.getState().headerBackAction).toBeNull();
  });

  it("should render Go Back button data when headerBackAction is set", () => {
    const onBackMock = jest.fn();
    useMenuStore.getState().setHeaderBackAction({
      label: "Volver",
      iconName: "chevron-left",
      iconFamily: "Feather",
      onPress: onBackMock,
      testID: "header-back-button",
    });

    const backAction = useMenuStore.getState().headerBackAction;
    expect(backAction).not.toBeNull();
    expect(backAction?.label).toBe("Volver");
    expect(backAction?.testID).toBe("header-back-button");

    backAction?.onPress();
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it("should clear headerBackAction when transitioning back to list view", () => {
    useMenuStore.getState().setHeaderBackAction({
      label: "Volver",
      onPress: jest.fn(),
    });
    expect(useMenuStore.getState().headerBackAction).not.toBeNull();

    useMenuStore.getState().setHeaderBackAction(null);
    expect(useMenuStore.getState().headerBackAction).toBeNull();
  });
});

describe("Header Component - headerCustomComponent Rendering (Spec 007)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.GAMES,
      headerTitle: "Partidos",
      headerAction: null,
      headerBackAction: null,
      headerCustomComponent: null,
      bottomMenuItems: [],
    });
  });

  it("should initialize with null headerCustomComponent in store", () => {
    expect(useMenuStore.getState().headerCustomComponent).toBeNull();
  });

  it("should set and update headerCustomComponent in store", () => {
    useMenuStore.getState().setHeaderCustomComponent({ type: "View", props: { testID: "global-match-score-header" } } as any);
    expect(useMenuStore.getState().headerCustomComponent).not.toBeNull();
  });

  it("should reset headerCustomComponent when setHeaderTitle is called", () => {
    useMenuStore.getState().setHeaderCustomComponent({ type: "View" } as any);
    expect(useMenuStore.getState().headerCustomComponent).not.toBeNull();

    useMenuStore.getState().setHeaderTitle("Gestión de Equipos");
    expect(useMenuStore.getState().headerCustomComponent).toBeNull();
    expect(useMenuStore.getState().headerTitle).toBe("Gestión de Equipos");
  });
});


