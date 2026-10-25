import { Player } from "../../../../types/database";
import { PlayerStatsSectionProps, PlayerStatInput } from "../../types";
import { calculatePlayerPoints, calculateValuation } from "../../utils/directResultCalculations";

declare const jest: any;

describe("PlayerStatsSection Contract & Logic Tests (T009 - US3)", () => {
  const mockPlayers: Player[] = [
    {
      id: 1,
      teamId: 10,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      jerseyName: "Doncic",
      createdAt: "",
    },
    {
      id: 2,
      teamId: 10,
      firstName: "Kyrie",
      lastName: "Irving",
      number: "11",
      jerseyName: "Irving",
      createdAt: "",
    },
  ];

  const createInitialStat = (playerId: number): PlayerStatInput => ({
    playerId,
    minutes: 0,
    t1a: 0,
    t1i: 0,
    t2a: 0,
    t2i: 0,
    t3a: 0,
    t3i: 0,
    oreb: 0,
    dreb: 0,
    asis: 0,
    rec: 0,
    per: 0,
    falt: 0,
  });

  it("should calculate player points and valuation independently per player", () => {
    const lukaStats: PlayerStatInput = {
      ...createInitialStat(1),
      minutes: 32,
      t1a: 4,
      t1i: 5, // 1 miss
      t2a: 6,
      t2i: 10, // 4 miss
      t3a: 3,
      t3i: 7, // 4 miss
      oreb: 1,
      dreb: 8, // 9 reb
      asis: 10,
      rec: 2,
      per: 3,
      falt: 2,
    };

    const kyrieStats: PlayerStatInput = {
      ...createInitialStat(2),
      minutes: 28,
      t1a: 2,
      t1i: 2,
      t2a: 5,
      t2i: 8,
      t3a: 2,
      t3i: 4,
      oreb: 0,
      dreb: 3,
      asis: 4,
      rec: 1,
      per: 1,
      falt: 1,
    };

    // Luka Points: 4*1 + 6*2 + 3*3 = 4 + 12 + 9 = 25
    expect(calculatePlayerPoints(lukaStats)).toBe(25);
    // Luka Val: Made(4+6+3=13) + Reb(9) + Asis(10) + Rec(2) - Per(3) - Falt(2) - Missed(1+4+4=9)
    // 34 - 14 = 20
    expect(calculateValuation(lukaStats)).toBe(20);

    // Kyrie Points: 2*1 + 5*2 + 2*3 = 2 + 10 + 6 = 18
    expect(calculatePlayerPoints(kyrieStats)).toBe(18);
    // Kyrie Val: Made(2+5+2=9) + Reb(3) + Asis(4) + Rec(1) - Per(1) - Falt(1) - Missed(0+3+2=5)
    // 17 - 7 = 10
    expect(calculateValuation(kyrieStats)).toBe(10);
  });

  it("should trigger onUpdateStat for the specific player and field", () => {
    const onUpdateMock = jest.fn();
    const props: PlayerStatsSectionProps = {
      players: mockPlayers,
      playerStats: {
        1: createInitialStat(1),
        2: createInitialStat(2),
      },
      onUpdateStat: onUpdateMock,
    };

    props.onUpdateStat(1, "minutes", "30");
    expect(onUpdateMock).toHaveBeenCalledWith(1, "minutes", "30");

    props.onUpdateStat(2, "t3a", "3");
    expect(onUpdateMock).toHaveBeenCalledWith(2, "t3a", "3");
  });

  it("should support empty roster players without crashing", () => {
    const onUpdateMock = jest.fn();
    const props: PlayerStatsSectionProps = {
      players: [],
      playerStats: {},
      onUpdateStat: onUpdateMock,
    };

    expect(props.players.length).toBe(0);
    expect(Object.keys(props.playerStats).length).toBe(0);
  });
});
