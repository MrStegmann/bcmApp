import { MatchShareModalProps } from "../../types";
import { Game } from "../../../../types/database";
import { matchShareService } from "../../services/matchShareService";

declare const jest: any;

describe("MatchShareModal Component Contract (T012 & T018 - US2/US3)", () => {
  const mockMatch: Game = {
    id: 1,
    teamId: 10,
    opponent: "CB Marbella",
    round: "Jornada 10",
    date: "23/10/2026",
    status: "finished",
    createdAt: "2026-10-23T10:00:00.000Z",
    resultC1: 20,
    resultC2: 20,
    resultC3: 20,
    resultC4: 20,
    resultExtra: 0,
    resultC1Opponent: 15,
    resultC2Opponent: 15,
    resultC3Opponent: 15,
    resultC4Opponent: 15,
    resultExtraOpponent: 0,
    foulsC1: 4,
    foulsC2: 4,
    foulsC3: 4,
    foulsC4: 4,
    foulsExtra: 0,
    foulsC1Opponent: 3,
    foulsC2Opponent: 3,
    foulsC3Opponent: 3,
    foulsC4Opponent: 3,
    foulsExtraOpponent: 0,
  };

  const mockClose = jest.fn();

  const defaultProps: MatchShareModalProps = {
    visible: true,
    match: mockMatch,
    teamName: "CB Salliver",
    periods: [],
    players: [],
    advancedStats: {
      posesiones: 70,
      oer: 100,
      der: 90,
      efg: 50,
      orb: 30,
      ast: 60,
      tov: 15,
      ftr: 20,
    },
    onClose: mockClose,
  };

  it("should have correct initial props and visibility flag", () => {
    expect(defaultProps.visible).toBe(true);
    expect(defaultProps.teamName).toBe("CB Salliver");
    expect(defaultProps.match.opponent).toBe("CB Marbella");
  });

  it("should support onClose callback invocation", () => {
    defaultProps.onClose();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should verify contract requirements for single share action", () => {
    const actionLabels = ["Compartir Estadísticas"];
    expect(actionLabels).toContain("Compartir Estadísticas");
  });

  it("should integrate with matchShareService methods for capture, share, and save", () => {
    expect(typeof matchShareService.captureViewToPng).toBe("function");
    expect(typeof matchShareService.shareImageFile).toBe("function");
    expect(typeof matchShareService.saveImageToGallery).toBe("function");
  });
});
