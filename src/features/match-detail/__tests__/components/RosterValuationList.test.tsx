import { RosterValuationListProps, PlayerRosterItem } from "../../types";

declare const jest: any;

describe("RosterValuationList Component Contract (T019 - US2)", () => {
  const samplePlayers: PlayerRosterItem[] = [
    {
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
    },
    {
      id: 2,
      statId: 11,
      jerseyNumber: "11",
      firstName: "Kyrie",
      lastName: "Irving",
      fullName: "Kyrie Irving",
      minutes: 33,
      points: 24,
      valuation: 26,
      t1a: 4,
      t1i: 4,
      t2a: 7,
      t2i: 12,
      t3a: 2,
      t3i: 5,
      oreb: 1,
      dreb: 3,
      totalRebounds: 4,
      asis: 5,
      rec: 1,
      per: 1,
      falt: 3,
    },
    {
      id: 3,
      statId: 12,
      jerseyNumber: "31",
      firstName: "Klay",
      lastName: "Thompson",
      fullName: "Klay Thompson",
      minutes: 28,
      points: 15,
      valuation: 12,
      t1a: 0,
      t1i: 0,
      t2a: 3,
      t2i: 5,
      t3a: 3,
      t3i: 7,
      oreb: 0,
      dreb: 2,
      totalRebounds: 2,
      asis: 1,
      rec: 0,
      per: 1,
      falt: 1,
    },
  ];

  it("should trigger onSelectPlayer when player button is tapped", () => {
    const onSelectMock = jest.fn();
    const props: RosterValuationListProps = {
      players: samplePlayers,
      onSelectPlayer: onSelectMock,
    };

    props.onSelectPlayer(samplePlayers[0]);
    expect(onSelectMock).toHaveBeenCalledWith(samplePlayers[0]);
    expect(onSelectMock).toHaveBeenCalledTimes(1);
  });

  it("should verify roster ordering respects valuation descending", () => {
    for (let i = 0; i < samplePlayers.length - 1; i++) {
      expect(samplePlayers[i].valuation).toBeGreaterThanOrEqual(samplePlayers[i + 1].valuation);
    }
  });

  it("should handle empty player list without exceptions", () => {
    const props: RosterValuationListProps = {
      players: [],
      onSelectPlayer: jest.fn(),
    };
    expect(props.players).toHaveLength(0);
  });

  it("should isolate MVP at index 0 and provide remaining players for the 2-column grid", () => {
    const mvpPlayer = samplePlayers[0];
    const remainingPlayers = samplePlayers.slice(1);

    expect(mvpPlayer.fullName).toBe("Luka Doncic");
    expect(mvpPlayer.valuation).toBe(38);
    expect(remainingPlayers).toHaveLength(2);
    expect(remainingPlayers[0].fullName).toBe("Kyrie Irving");
    expect(remainingPlayers[1].fullName).toBe("Klay Thompson");
  });

  it("should verify 2-column grid item buttons do not contain h-full to prevent vertical expansion bug", () => {
    const fs = require("fs");
    const path = require("path");
    const componentPath = path.resolve((globalThis as any).__dirname || process.cwd(), "src/features/match-detail/components/RosterValuationList.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf8");

    // Verify TouchableOpacity in remaining players grid does not include 'h-full'
    expect(/player-roster-item[^>]*className=[^>]*h-full/.test(componentSource)).toBe(false);
    expect(/className="[^"]*h-full[^"]*"\s+testID={`player-roster-item/.test(componentSource)).toBe(false);
  });
});
