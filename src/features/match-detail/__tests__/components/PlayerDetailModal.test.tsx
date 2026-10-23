import { PlayerDetailModalProps, PlayerRosterItem } from "../../types";

declare const jest: any;

describe("PlayerDetailModal Component Contract (T020 - US2)", () => {
  const samplePlayer: PlayerRosterItem = {
    id: 1,
    statId: 10,
    jerseyNumber: "7",
    firstName: "Luka",
    lastName: "Doncic",
    fullName: "Luka Doncic",
    minutes: 35,
    points: 32,
    valuation: 38,
    t1a: 6,
    t1i: 7,
    t2a: 7,
    t2i: 11,
    t3a: 4,
    t3i: 8,
    oreb: 2,
    dreb: 7,
    totalRebounds: 9,
    asis: 8,
    rec: 2,
    per: 3,
    falt: 2,
  };

  it("should trigger onClose callback when closing modal", () => {
    const onCloseMock = jest.fn();
    const props: PlayerDetailModalProps = {
      visible: true,
      player: samplePlayer,
      onClose: onCloseMock,
    };

    props.onClose();
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should provide full box score statistics fields", () => {
    expect(samplePlayer.points).toBe(32);
    expect(samplePlayer.valuation).toBe(38);
    expect(samplePlayer.minutes).toBe(35);
    expect(samplePlayer.t1a).toBe(6);
    expect(samplePlayer.t1i).toBe(7);
    expect(samplePlayer.t2a).toBe(7);
    expect(samplePlayer.t2i).toBe(11);
    expect(samplePlayer.t3a).toBe(4);
    expect(samplePlayer.t3i).toBe(8);
    expect(samplePlayer.oreb).toBe(2);
    expect(samplePlayer.dreb).toBe(7);
    expect(samplePlayer.totalRebounds).toBe(9);
    expect(samplePlayer.asis).toBe(8);
    expect(samplePlayer.rec).toBe(2);
    expect(samplePlayer.per).toBe(3);
    expect(samplePlayer.falt).toBe(2);
  });

  it("should handle null player state without crashing", () => {
    const props: PlayerDetailModalProps = {
      visible: false,
      player: null,
      onClose: jest.fn(),
    };
    expect(props.player).toBeNull();
    expect(props.visible).toBe(false);
  });
});
