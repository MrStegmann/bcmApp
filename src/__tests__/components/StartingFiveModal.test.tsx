import { InGamePlayer, StartingFiveModalProps } from "../../types/match";
import { validateStartingFive } from "../../store/GameStore";

declare const jest: any;

describe("StartingFiveModal Contract & Logic Tests (T004 - US1)", () => {
  const mockRoster: InGamePlayer[] = [
    {
      id: 1,
      firstName: "Luka",
      lastName: "Doncic",
      number: "77",
      position: "Base",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 2,
      firstName: "Kyrie",
      lastName: "Irving",
      number: "11",
      position: "Escolta",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 3,
      firstName: "Klay",
      lastName: "Thompson",
      number: "31",
      position: "Alero",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 4,
      firstName: "P.J.",
      lastName: "Washington",
      number: "25",
      position: "Ala-Pívot",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 5,
      firstName: "Dereck",
      lastName: "Lively",
      number: "2",
      position: "Pívot",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
    {
      id: 6,
      firstName: "Daniel",
      lastName: "Gafford",
      number: "21",
      position: "Pívot",
      isOnCourt: false,
      secondsPlayed: 0,
      t1a: 0, t1i: 0, t2a: 0, t2i: 0, t3a: 0, t3i: 0,
      oreb: 0, dreb: 0, asis: 0, rec: 0, per: 0, falt: 0, valuation: 0,
    },
  ];

  it("should enforce exactly 5 players before allowing confirmation", () => {
    const onConfirmMock = jest.fn();

    const handleConfirm = (selectedIds: number[]) => {
      if (selectedIds.length !== 5 || !validateStartingFive(selectedIds)) {
        return false;
      }
      onConfirmMock(selectedIds);
      return true;
    };

    // 0 players
    expect(handleConfirm([])).toBe(false);
    expect(onConfirmMock).not.toHaveBeenCalled();

    // 4 players
    expect(handleConfirm([1, 2, 3, 4])).toBe(false);
    expect(onConfirmMock).not.toHaveBeenCalled();

    // 5 players
    expect(handleConfirm([1, 2, 3, 4, 5])).toBe(true);
    expect(onConfirmMock).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
  });

  it("should handle toggling players and prevent exceeding 5 selected", () => {
    let selectedIds: number[] = [];

    const togglePlayer = (playerId: number) => {
      if (selectedIds.includes(playerId)) {
        selectedIds = selectedIds.filter((id) => id !== playerId);
      } else if (selectedIds.length < 5) {
        selectedIds = [...selectedIds, playerId];
      }
    };

    togglePlayer(1);
    togglePlayer(2);
    togglePlayer(3);
    togglePlayer(4);
    togglePlayer(5);
    expect(selectedIds).toEqual([1, 2, 3, 4, 5]);

    // Attempting 6th should not exceed 5
    togglePlayer(6);
    expect(selectedIds).toEqual([1, 2, 3, 4, 5]);

    // Toggling off player 1
    togglePlayer(1);
    expect(selectedIds).toEqual([2, 3, 4, 5]);

    // Now adding player 6 works
    togglePlayer(6);
    expect(selectedIds).toEqual([2, 3, 4, 5, 6]);
  });

  it("should conform to StartingFiveModalProps contract", () => {
    const onConfirmMock = jest.fn();
    const props: StartingFiveModalProps = {
      visible: true,
      roster: mockRoster,
      onConfirmStartingFive: onConfirmMock,
    };

    expect(props.visible).toBe(true);
    expect(props.roster.length).toBe(6);
    props.onConfirmStartingFive([1, 2, 3, 4, 5]);
    expect(onConfirmMock).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
  });

  it("should handle empty roster gracefully", () => {
    const onConfirmMock = jest.fn();
    const props: StartingFiveModalProps = {
      visible: true,
      roster: [],
      onConfirmStartingFive: onConfirmMock,
    };
    expect(props.roster.length).toBe(0);
  });

  it("should handle toggling players with type coercion safely", () => {
    let selectedIds: number[] = [];
    const togglePlayer = (playerId: any) => {
      const idNum = Number(playerId);
      const exists = selectedIds.some((id) => Number(id) === idNum);
      if (exists) {
        selectedIds = selectedIds.filter((id) => Number(id) !== idNum);
      } else if (selectedIds.length < 5) {
        selectedIds = [...selectedIds, idNum];
      }
    };

    togglePlayer("1");
    togglePlayer(2);
    expect(selectedIds).toEqual([1, 2]);
    togglePlayer(1);
    expect(selectedIds).toEqual([2]);
  });
});
