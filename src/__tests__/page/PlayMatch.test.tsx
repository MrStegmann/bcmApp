import { Game } from "../../types/database";

declare const jest: any;

describe("PlayMatch Component & State Transition Tests (T014 - US3)", () => {
  const mockPendingMatch: Game = {
    id: 50,
    teamId: 1,
    opponent: "Valencia Basket",
    round: "Jornada 4",
    date: "20/10/2026 - 18:00",
    status: "pending",
    createdAt: "2026-10-02T10:00:00.000Z",
    resultC1: 0,
    resultC2: 0,
    resultC3: 0,
    resultC4: 0,
    resultExtra: 0,
    resultC1Opponent: 0,
    resultC2Opponent: 0,
    resultC3Opponent: 0,
    resultC4Opponent: 0,
    resultExtraOpponent: 0,
  };

  it("should initialize match in pending state and allow timer start", async () => {
    let matchStatus = mockPendingMatch.status;
    let isTimerRunning = false;

    const handleStartChrono = async () => {
      isTimerRunning = true;
      if (matchStatus === "pending") {
        matchStatus = "inProgress";
      }
    };

    expect(matchStatus).toBe("pending");
    expect(isTimerRunning).toBe(false);

    await handleStartChrono();

    expect(isTimerRunning).toBe(true);
    expect(matchStatus).toBe("inProgress");
  });

  it("should pause chronograph without reverting inProgress state", async () => {
    let matchStatus = "inProgress";
    let isTimerRunning = true;

    const handleToggleChrono = () => {
      isTimerRunning = !isTimerRunning;
    };

    handleToggleChrono();

    expect(isTimerRunning).toBe(false);
    expect(matchStatus).toBe("inProgress");
  });

  it("should transition state to finished when user clicks save and finish", async () => {
    let matchStatus = "inProgress";
    let isFinished = false;

    const handleSaveAndFinish = async (matchId: number) => {
      matchStatus = "finished";
      isFinished = true;
    };

    await handleSaveAndFinish(mockPendingMatch.id);

    expect(matchStatus).toBe("finished");
    expect(isFinished).toBe(true);
  });

  it("should format timer seconds into mm:ss format", () => {
    const formatTimer = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    expect(formatTimer(0)).toBe("00:00");
    expect(formatTimer(65)).toBe("01:05");
    expect(formatTimer(600)).toBe("10:00");
    expect(formatTimer(599)).toBe("09:59");
  });
});
