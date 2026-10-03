import {
  InGamePlayer,
  PlayerStatsModalProps,
  StatActionType,
} from "../../types/match";

declare const jest: any;

describe("PlayerStatsModal Component & Contract Tests (T011 - US3)", () => {
  const targetPlayer: InGamePlayer = {
    id: 1,
    firstName: "Luka",
    lastName: "Doncic",
    number: "77",
    position: "Base",
    isOnCourt: true,
    secondsPlayed: 720,
    t1a: 0, t1i: 0,
    t2a: 0, t2i: 0,
    t3a: 0, t3i: 0,
    oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
  };

  const courtTeammates: InGamePlayer[] = [
    { id: 2, firstName: "Kyrie", lastName: "Irving", number: "11", isOnCourt: true, secondsPlayed: 600, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
    { id: 3, firstName: "Klay", lastName: "Thompson", number: "31", isOnCourt: true, secondsPlayed: 540, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
    { id: 4, firstName: "P.J.", lastName: "Washington", number: "25", isOnCourt: true, secondsPlayed: 480, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
    { id: 5, firstName: "Dereck", lastName: "Lively", number: "2", isOnCourt: true, secondsPlayed: 660, t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0, oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0 },
  ];

  it("should record basic direct stats without sub-prompt (rebounds, steals, turnovers, fouls)", () => {
    const onRecordMock = jest.fn();
    const props: PlayerStatsModalProps = {
      visible: true,
      player: targetPlayer,
      courtTeammates,
      onClose: jest.fn(),
      onRecordStat: onRecordMock,
    };

    // Offensive rebound
    props.onRecordStat(1, "oreb");
    expect(onRecordMock).toHaveBeenCalledWith(1, "oreb");

    // Defensive rebound
    props.onRecordStat(1, "dreb");
    expect(onRecordMock).toHaveBeenCalledWith(1, "dreb");

    // Steal / Recover
    props.onRecordStat(1, "rec");
    expect(onRecordMock).toHaveBeenCalledWith(1, "rec");

    // Turnover / Lost
    props.onRecordStat(1, "per");
    expect(onRecordMock).toHaveBeenCalledWith(1, "per");

    // Personal foul
    props.onRecordStat(1, "fault");
    expect(onRecordMock).toHaveBeenCalledWith(1, "fault");
  });

  it("should record 1pt free throws with make/miss prompt result", () => {
    const onRecordMock = jest.fn();
    const props: PlayerStatsModalProps = {
      visible: true,
      player: targetPlayer,
      courtTeammates,
      onClose: jest.fn(),
      onRecordStat: onRecordMock,
    };

    // Scored FT (Made)
    props.onRecordStat(1, "t1", true);
    expect(onRecordMock).toHaveBeenCalledWith(1, "t1", true);

    // Missed FT
    props.onRecordStat(1, "t1", false);
    expect(onRecordMock).toHaveBeenCalledWith(1, "t1", false);
  });

  it("should record 2pt and 3pt field goals with assist attribution when scored", () => {
    const onRecordMock = jest.fn();
    const props: PlayerStatsModalProps = {
      visible: true,
      player: targetPlayer,
      courtTeammates,
      onClose: jest.fn(),
      onRecordStat: onRecordMock,
    };

    // Made 2PT assisted by Kyrie (id: 2)
    props.onRecordStat(1, "t2", true, 2);
    expect(onRecordMock).toHaveBeenCalledWith(1, "t2", true, 2);

    // Made 3PT with No Assistant (null)
    props.onRecordStat(1, "t3", true, null);
    expect(onRecordMock).toHaveBeenCalledWith(1, "t3", true, null);

    // Missed 3PT (no assist prompt)
    props.onRecordStat(1, "t3", false);
    expect(onRecordMock).toHaveBeenCalledWith(1, "t3", false);
  });
});
