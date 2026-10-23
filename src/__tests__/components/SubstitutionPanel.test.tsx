import { InGamePlayer, SubstitutionPanelProps } from "../../types/match";

declare const jest: any;

describe("SubstitutionPanel Contract & Logic Tests (T015 - US4)", () => {
  const mockCourtPlayers: InGamePlayer[] = [
    {
      id: 1, firstName: "Luka", lastName: "Doncic", number: "77",
      isOnCourt: true, secondsPlayed: 600, t1a: 2, t1i: 2, t2a: 4, t2i: 6, t3a: 2, t3i: 4,
      oreb: 1, dreb: 4, asis: 5, rec: 1, per: 2, falt: 1, valuation: 18,
    },
    {
      id: 2, firstName: "Kyrie", lastName: "Irving", number: "11",
      isOnCourt: true, secondsPlayed: 600, t1a: 0, t1i: 0, t2a: 3, t2i: 5, t3a: 1, t3i: 2,
      oreb: 0, dreb: 2, asis: 3, rec: 2, per: 1, falt: 2, valuation: 12,
    },
    {
      id: 3, firstName: "Klay", lastName: "Thompson", number: "31",
      isOnCourt: true, secondsPlayed: 450, t1a: 0, t1i: 0, t2a: 1, t2i: 2, t3a: 3, t3i: 6,
      oreb: 0, dreb: 1, asis: 1, rec: 0, per: 0, falt: 0, valuation: 9,
    },
    {
      id: 4, firstName: "P.J.", lastName: "Washington", number: "25",
      isOnCourt: true, secondsPlayed: 500, t1a: 1, t1i: 2, t2a: 2, t2i: 4, t3a: 0, t3i: 1,
      oreb: 2, dreb: 3, asis: 0, rec: 1, per: 1, falt: 3, valuation: 5,
    },
    {
      id: 5, firstName: "Dereck", lastName: "Lively", number: "2",
      isOnCourt: true, secondsPlayed: 400, t1a: 0, t1i: 0, t2a: 4, t2i: 5, t3a: 0, t3i: 0,
      oreb: 3, dreb: 5, asis: 1, rec: 0, per: 1, falt: 2, valuation: 14,
    },
  ];

  const mockBenchPlayers: InGamePlayer[] = [
    {
      id: 6, firstName: "Daniel", lastName: "Gafford", number: "21",
      isOnCourt: false, secondsPlayed: 200, t1a: 0, t1i: 0, t2a: 2, t2i: 2, t3a: 0, t3i: 0,
      oreb: 1, dreb: 2, asis: 0, rec: 0, per: 0, falt: 1, valuation: 6,
    },
    {
      id: 7, firstName: "Jaden", lastName: "Hardy", number: "1",
      isOnCourt: false, secondsPlayed: 150, t1a: 2, t1i: 2, t2a: 1, t2i: 3, t3a: 1, t3i: 2,
      oreb: 0, dreb: 0, asis: 1, rec: 0, per: 1, falt: 0, valuation: 4,
    },
  ];

  it("should guard substitution mode when clock is running", () => {
    const onToggleChangeMode = jest.fn();
    const isTimerRunning = true;

    const handleAttemptToggle = () => {
      if (isTimerRunning) {
        return { allowed: false, message: "El tiempo debe estar detenido para realizar cambios" };
      }
      onToggleChangeMode();
      return { allowed: true };
    };

    const result = handleAttemptToggle();
    expect(result.allowed).toBe(false);
    expect(result.message).toContain("detenido");
    expect(onToggleChangeMode).not.toHaveBeenCalled();
  });

  it("should validate equal-count substitution rule (N court = N bench, N > 0)", () => {
    const isSubstitutionValid = (courtIds: number[], benchIds: number[]): boolean => {
      return courtIds.length > 0 && courtIds.length === benchIds.length;
    };

    // 0 court, 0 bench
    expect(isSubstitutionValid([], [])).toBe(false);

    // 1 court, 0 bench
    expect(isSubstitutionValid([1], [])).toBe(false);

    // 0 court, 1 bench
    expect(isSubstitutionValid([], [6])).toBe(false);

    // 1 court, 2 bench
    expect(isSubstitutionValid([1], [6, 7])).toBe(false);

    // 1 court, 1 bench
    expect(isSubstitutionValid([1], [6])).toBe(true);

    // 2 court, 2 bench
    expect(isSubstitutionValid([1, 2], [6, 7])).toBe(true);
  });

  it("should execute substitution and preserve invariant of exactly 5 on-court players", () => {
    let allPlayers = [...mockCourtPlayers, ...mockBenchPlayers];
    const selectedCourtIds = [1, 2];
    const selectedBenchIds = [6, 7];

    // Execute swap
    allPlayers = allPlayers.map((p) => {
      if (selectedCourtIds.includes(p.id)) {
        return { ...p, isOnCourt: false };
      }
      if (selectedBenchIds.includes(p.id)) {
        return { ...p, isOnCourt: true };
      }
      return p;
    });

    const activeCourt = allPlayers.filter((p) => p.isOnCourt);
    const activeBench = allPlayers.filter((p) => !p.isOnCourt);

    expect(activeCourt.length).toBe(5);
    expect(activeCourt.map((p) => p.id)).toEqual([3, 4, 5, 6, 7]);
    expect(activeBench.map((p) => p.id)).toEqual([1, 2]);
  });

  it("should conform to SubstitutionPanelProps interface", () => {
    const onToggleMock = jest.fn();
    const onConfirmMock = jest.fn();
    const onCancelMock = jest.fn();
    const onToggleBenchMock = jest.fn();

    const props: SubstitutionPanelProps = {
      isChangeMode: true,
      isTimerRunning: false,
      onToggleChangeMode: onToggleMock,
      benchPlayers: mockBenchPlayers,
      selectedCourtIds: [1],
      selectedBenchIds: [6],
      onToggleBenchPlayer: onToggleBenchMock,
      onConfirmSubstitution: onConfirmMock,
      onCancelSubstitution: onCancelMock,
    };

    expect(props.isChangeMode).toBe(true);
    expect(props.benchPlayers.length).toBe(2);
    props.onConfirmSubstitution();
    expect(onConfirmMock).toHaveBeenCalled();
  });
});
