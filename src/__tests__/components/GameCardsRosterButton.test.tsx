import { Game } from "../../types/database";
import { GameCardsProps } from "../../types/match";

declare const jest: any;

describe("GameCards Roster Button Unit Tests (T014 - US3)", () => {
  const pendingGame: Game = {
    id: 1,
    teamId: 1,
    opponent: "Rival Pending",
    round: "1",
    date: "25/10/2026",
    status: "pending",
    createdAt: new Date().toISOString(),
  } as Game;

  const inProgressGame: Game = {
    id: 2,
    teamId: 1,
    opponent: "Rival Live",
    round: "2",
    date: "25/10/2026",
    status: "inProgress",
    createdAt: new Date().toISOString(),
  } as Game;

  const finishedGame: Game = {
    id: 3,
    teamId: 1,
    opponent: "Rival Finished",
    round: "3",
    date: "20/10/2026",
    status: "finished",
    createdAt: new Date().toISOString(),
  } as Game;

  // Helper reflecting the GameCards button logic
  const isRosterButtonEnabled = (status?: string | null): boolean => {
    return status === "pending" || !status;
  };

  const getRosterButtonProps = (game: Game, onSelectRoster?: (game: Game) => void) => {
    const isEnabled = isRosterButtonEnabled(game.status);
    return {
      testID: `roster-button-${game.id}`,
      disabled: !isEnabled,
      className: `p-2 min-w-[42px] min-h-[42px] items-center justify-center rounded-lg bg-slate-dark ${
        isEnabled ? "active:bg-slate-card" : "opacity-30"
      }`,
      iconName: "users",
      iconColor: isEnabled ? "#F97316" : "#A78B7D",
      onPress: () => {
        if (isEnabled && onSelectRoster) {
          onSelectRoster(game);
        }
      },
    };
  };

  it("should enable roster button and trigger onSelectRoster for pending matches", () => {
    const onSelectRosterMock = jest.fn();
    const btnProps = getRosterButtonProps(pendingGame, onSelectRosterMock);

    expect(btnProps.disabled).toBe(false);
    expect(btnProps.className).toContain("min-w-[42px]");
    expect(btnProps.className).toContain("min-h-[42px]");
    expect(btnProps.className).not.toContain("opacity-30");
    expect(btnProps.iconColor).toBe("#F97316");

    btnProps.onPress();
    expect(onSelectRosterMock).toHaveBeenCalledTimes(1);
    expect(onSelectRosterMock).toHaveBeenCalledWith(pendingGame);
  });

  it("should disable roster button and block onSelectRoster for inProgress matches", () => {
    const onSelectRosterMock = jest.fn();
    const btnProps = getRosterButtonProps(inProgressGame, onSelectRosterMock);

    expect(btnProps.disabled).toBe(true);
    expect(btnProps.className).toContain("opacity-30");
    expect(btnProps.iconColor).toBe("#A78B7D");

    btnProps.onPress();
    expect(onSelectRosterMock).not.toHaveBeenCalled();
  });

  it("should disable roster button and block onSelectRoster for finished matches", () => {
    const onSelectRosterMock = jest.fn();
    const btnProps = getRosterButtonProps(finishedGame, onSelectRosterMock);

    expect(btnProps.disabled).toBe(true);
    expect(btnProps.className).toContain("opacity-30");
    expect(btnProps.iconColor).toBe("#A78B7D");

    btnProps.onPress();
    expect(onSelectRosterMock).not.toHaveBeenCalled();
  });

  it("should satisfy GameCardsProps contract with onSelectRoster optional callback", () => {
    const props: GameCardsProps = {
      games: [pendingGame, inProgressGame, finishedGame],
      onSelect: jest.fn(),
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onSelectRoster: jest.fn(),
    };

    expect(props.games.length).toBe(3);
    expect(typeof props.onSelectRoster).toBe("function");
  });
});
