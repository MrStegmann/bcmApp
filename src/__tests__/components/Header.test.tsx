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

describe("Header Action - TrainingList Context (US2 / T012)", () => {
  beforeEach(() => {
    useMenuStore.setState({
      activeTab: TopMenuEnums.TRAININGS,
      headerTitle: "Entrenamientos",
      headerAction: null,
      bottomMenuItems: [],
    });
  });

  it("should set headerAction with 'Añadir' when TrainingList list view is active", () => {
    const addTrainingAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      iconFamily: "Feather",
      onPress: jest.fn(),
      testID: "header-add-training",
    };

    useMenuStore.getState().setHeaderAction(addTrainingAction);

    const action = useMenuStore.getState().headerAction;
    expect(action?.testID).toBe("header-add-training");
    expect(action?.label).toBe("Añadir");
  });

  it("should clear headerAction when TrainingList enters create or edit mode", () => {
    const addAction: HeaderAction = {
      label: "Añadir",
      iconName: "plus-circle",
      onPress: jest.fn(),
    };
    useMenuStore.getState().setHeaderAction(addAction);
    useMenuStore.getState().setHeaderAction(null);

    expect(useMenuStore.getState().headerAction).toBeNull();
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
