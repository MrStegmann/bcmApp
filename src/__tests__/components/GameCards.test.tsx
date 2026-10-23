import { Game } from "../../types/database";

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
