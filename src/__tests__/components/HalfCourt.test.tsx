import { InGamePlayer, HalfCourtProps } from "../../types/match";
import { calculatePlayerPoints } from "../../store/GameStore";

declare const jest: any;

describe("HalfCourt Component & Contract Tests (T010 - US3)", () => {
  const mockCourtPlayers: InGamePlayer[] = [
    {
      id: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      position: "Base",
      isOnCourt: true,
      secondsPlayed: 720, // 12 mins
      t1a: 2, t1i: 3,
      t2a: 4, t2i: 6,
      t3a: 2, t3i: 5,
      oreb: 1, dreb: 4, asis: 5, rec: 2, per: 1, falt: 2, valuation: 16,
    },
    {
      id: 2,
      firstName: "Kyrie",
      lastName: "Irving",
      number: "11",
      position: "Escolta",
      isOnCourt: true,
      secondsPlayed: 600, // 10 mins
      t1a: 0, t1i: 0,
      t2a: 3, t2i: 5,
      t3a: 1, t3i: 2,
      oreb: 0, dreb: 2, asis: 3, rec: 1, per: 0, falt: 1, valuation: 10,
    },
    {
      id: 3,
      firstName: "Klay",
      lastName: "Thompson",
      number: "31",
      position: "Alero",
      isOnCourt: true,
      secondsPlayed: 540, // 9 mins
      t1a: 0, t1i: 0,
      t2a: 1, t2i: 2,
      t3a: 3, t3i: 6,
      oreb: 0, dreb: 1, asis: 1, rec: 0, per: 1, falt: 0, valuation: 8,
    },
    {
      id: 4,
      firstName: "P.J.",
      lastName: "Washington",
      number: "25",
      position: "Ala-Pívot",
      isOnCourt: true,
      secondsPlayed: 480, // 8 mins
      t1a: 1, t1i: 2,
      t2a: 2, t2i: 4,
      t3a: 0, t3i: 1,
      oreb: 2, dreb: 3, asis: 0, rec: 1, per: 2, falt: 3, valuation: 5,
    },
    {
      id: 5,
      firstName: "Dereck",
      lastName: "Lively",
      number: "2",
      position: "Pívot",
      isOnCourt: true,
      secondsPlayed: 660, // 11 mins
      t1a: 2, t1i: 4,
      t2a: 4, t2i: 5,
      t3a: 0, t3i: 0,
      oreb: 3, dreb: 5, asis: 1, rec: 1, per: 0, falt: 2, valuation: 15,
    },
  ];

  it("should calculate correct points metric for each court player", () => {
    // Luka: 2*1 + 4*2 + 2*3 = 16 pts
    expect(calculatePlayerPoints(mockCourtPlayers[0])).toBe(16);
    // Kyrie: 0*1 + 3*2 + 1*3 = 9 pts
    expect(calculatePlayerPoints(mockCourtPlayers[1])).toBe(9);
    // Klay: 0*1 + 1*2 + 3*3 = 11 pts
    expect(calculatePlayerPoints(mockCourtPlayers[2])).toBe(11);
    // P.J.: 1*1 + 2*2 + 0*3 = 5 pts
    expect(calculatePlayerPoints(mockCourtPlayers[3])).toBe(5);
    // Lively: 2*1 + 4*2 + 0*3 = 10 pts
    expect(calculatePlayerPoints(mockCourtPlayers[4])).toBe(10);
  });

  it("should format minutes / points metric correctly", () => {
    const formatMinPts = (player: InGamePlayer) => {
      const mins = Math.floor(player.secondsPlayed / 60);
      const pts = calculatePlayerPoints(player);
      return `${mins}' / ${pts} pts`;
    };

    expect(formatMinPts(mockCourtPlayers[0])).toBe("12' / 16 pts");
    expect(formatMinPts(mockCourtPlayers[1])).toBe("10' / 9 pts");
  });

  it("should verify HalfCourtProps contract and player selection callback", () => {
    const onSelectMock = jest.fn();
    const props: HalfCourtProps = {
      courtPlayers: mockCourtPlayers,
      onSelectPlayer: onSelectMock,
      isChangeMode: false,
      selectedPlayerIds: [],
    };

    expect(props.courtPlayers.length).toBe(5);
    props.onSelectPlayer(mockCourtPlayers[0]);
    expect(onSelectMock).toHaveBeenCalledWith(mockCourtPlayers[0]);
  });

  it("should support change mode selection highlights", () => {
    const props: HalfCourtProps = {
      courtPlayers: mockCourtPlayers,
      onSelectPlayer: jest.fn(),
      isChangeMode: true,
      selectedPlayerIds: [1, 2],
    };

    expect(props.isChangeMode).toBe(true);
    expect(props.selectedPlayerIds).toContain(1);
    expect(props.selectedPlayerIds).toContain(2);
    expect(props.selectedPlayerIds).not.toContain(3);
  });
});
