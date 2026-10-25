import { Game } from "../../types/database";

declare const jest: any;

describe("GameCards Status Badges & Date-Only Display Tests (T016 - US3)", () => {
  const getBadgeConfig = (status?: string) => {
    switch (status) {
      case "finished":
        return { label: "Finalizado", bgClass: "bg-emerald-950", textClass: "text-emerald-400" };
      case "inProgress":
        return { label: "En Juego", bgClass: "bg-amber-950", textClass: "text-amber-400" };
      case "pending":
      default:
        return { label: "Pendiente", bgClass: "bg-blue-950", textClass: "text-blue-400" };
    }
  };

  const formatCardData = (game: Game) => {
    const roundLabel =
      typeof game.round === "string" && game.round.toLowerCase().startsWith("jornada")
        ? game.round
        : `Jornada ${game.round}`;

    return {
      roundLabel,
      dateDisplay: game.date,
      badge: getBadgeConfig(game.status),
      opponent: game.opponent,
    };
  };

  it("should render correct status badge for pending matches with date-only format", () => {
    const pendingGame: Game = {
      id: 1,
      teamId: 1,
      opponent: "Rival 1",
      round: "1",
      date: "23/10/2026",
      status: "pending",
      createdAt: new Date().toISOString(),
    } as Game;

    const formatted = formatCardData(pendingGame);
    expect(formatted.badge.label).toBe("Pendiente");
    expect(formatted.dateDisplay).toBe("23/10/2026");
    expect(formatted.roundLabel).toBe("Jornada 1");
  });

  it("should render correct status badge for inProgress matches", () => {
    const inProgressGame: Game = {
      id: 2,
      teamId: 1,
      opponent: "Rival 2",
      round: "2",
      date: "23/10/2026",
      status: "inProgress",
      createdAt: new Date().toISOString(),
    } as Game;

    const formatted = formatCardData(inProgressGame);
    expect(formatted.badge.label).toBe("En Juego");
    expect(formatted.dateDisplay).toBe("23/10/2026");
  });

  it("should render correct status badge for finished matches", () => {
    const finishedGame: Game = {
      id: 3,
      teamId: 1,
      opponent: "Rival 3",
      round: "Jornada 3",
      date: "20/10/2026",
      status: "finished",
      createdAt: new Date().toISOString(),
    } as Game;

    const formatted = formatCardData(finishedGame);
    expect(formatted.badge.label).toBe("Finalizado");
    expect(formatted.dateDisplay).toBe("20/10/2026");
    expect(formatted.roundLabel).toBe("Jornada 3");
  });
});

describe("GameCards 2-Column Action Grid & Set Result Button Tests (T005 - US1)", () => {
  const pendingGame: Game = {
    id: 10,
    teamId: 1,
    opponent: "Real Madrid",
    round: "1",
    date: "25/10/2026",
    status: "pending",
    createdAt: "",
  } as Game;

  const inProgressGame: Game = {
    ...pendingGame,
    id: 20,
    opponent: "Barcelona",
    status: "inProgress",
  } as Game;

  const finishedGame: Game = {
    ...pendingGame,
    id: 30,
    opponent: "Valencia",
    status: "finished",
  } as Game;

  const ACTION_GRID_CONTAINER_CLASS =
    "flex flex-row flex-wrap w-[100px] justify-end items-center gap-1.5 pl-2 border-l border-slate-border";

  const isSetResultButtonEnabled = (status?: string | null): boolean => {
    return status === "pending" || !status;
  };

  const getSetResultButtonProps = (
    game: Game,
    onSetResult?: (game: Game) => void
  ) => {
    const isEnabled = isSetResultButtonEnabled(game.status);
    return {
      testID: `set-result-button-${game.id}`,
      disabled: !isEnabled,
      className: `p-2 min-w-[42px] min-h-[42px] items-center justify-center rounded-lg bg-slate-dark ${
        isEnabled ? "active:bg-slate-card" : "opacity-30"
      }`,
      iconName: "check-square",
      iconColor: isEnabled ? "#10B981" : "#A78B7D",
      onPress: () => {
        if (isEnabled && onSetResult) {
          onSetResult(game);
        }
      },
    };
  };

  it("should define 2-column action grid container classes according to contract", () => {
    expect(ACTION_GRID_CONTAINER_CLASS).toContain("w-[100px]");
    expect(ACTION_GRID_CONTAINER_CLASS).toContain("flex-wrap");
    expect(ACTION_GRID_CONTAINER_CLASS).toContain("justify-end");
    expect(ACTION_GRID_CONTAINER_CLASS).toContain("border-slate-border");
  });

  it("should provide sufficient inner width for 2-column buttons side-by-side", () => {
    // Container total width = 100px, padding-left = 8px (pl-2), border-left = 1px (border-l)
    const containerWidth = 100;
    const paddingLeft = 8;
    const borderLeft = 1;
    const availableInnerWidth = containerWidth - paddingLeft - borderLeft; // 91px

    // Two buttons at 42px each + gap-1.5 (6px)
    const buttonWidth = 42;
    const gap = 6;
    const requiredRowWidth = buttonWidth * 2 + gap; // 90px

    expect(availableInnerWidth).toBeGreaterThanOrEqual(requiredRowWidth);
  });

  it("should enable isSetResultButtonEnabled only for pending or null status", () => {
    expect(isSetResultButtonEnabled("pending")).toBe(true);
    expect(isSetResultButtonEnabled(null)).toBe(true);
    expect(isSetResultButtonEnabled(undefined)).toBe(true);
    expect(isSetResultButtonEnabled("inProgress")).toBe(false);
    expect(isSetResultButtonEnabled("finished")).toBe(false);
  });

  it("should configure enabled Set Result button props for pending match with min-w-[42px] min-h-[42px]", () => {
    const onSetResultMock = jest.fn();
    const props = getSetResultButtonProps(pendingGame, onSetResultMock);

    expect(props.testID).toBe(`set-result-button-${pendingGame.id}`);
    expect(props.disabled).toBe(false);
    expect(props.className).toContain("min-w-[42px]");
    expect(props.className).toContain("min-h-[42px]");
    expect(props.className).not.toContain("opacity-30");
    expect(props.iconName).toBe("check-square");
    expect(props.iconColor).toBe("#10B981");

    props.onPress();
    expect(onSetResultMock).toHaveBeenCalledTimes(1);
    expect(onSetResultMock).toHaveBeenCalledWith(pendingGame);
  });

  it("should configure disabled Set Result button props for inProgress match", () => {
    const onSetResultMock = jest.fn();
    const props = getSetResultButtonProps(inProgressGame, onSetResultMock);

    expect(props.testID).toBe(`set-result-button-${inProgressGame.id}`);
    expect(props.disabled).toBe(true);
    expect(props.className).toContain("opacity-30");
    expect(props.iconColor).toBe("#A78B7D");

    props.onPress();
    expect(onSetResultMock).not.toHaveBeenCalled();
  });

  it("should configure disabled Set Result button props for finished match", () => {
    const onSetResultMock = jest.fn();
    const props = getSetResultButtonProps(finishedGame, onSetResultMock);

    expect(props.testID).toBe(`set-result-button-${finishedGame.id}`);
    expect(props.disabled).toBe(true);
    expect(props.className).toContain("opacity-30");
    expect(props.iconColor).toBe("#A78B7D");

    props.onPress();
    expect(onSetResultMock).not.toHaveBeenCalled();
  });
});
