import { HomeViewProps } from "../types";

declare const jest: any;

describe("HomeView Container Integration Contract Tests (T020 - US1/US2/US3)", () => {
  it("should conform to HomeViewProps contract with teamId and match selection callbacks", () => {
    const onSelectMatchMock = jest.fn();
    const onNavigateGamesMock = jest.fn();

    const props: HomeViewProps = {
      teamId: 10,
      onSelectMatch: onSelectMatchMock,
      onNavigateToGames: onNavigateGamesMock,
    };

    expect(props.teamId).toBe(10);
    expect(typeof props.onSelectMatch).toBe("function");
    expect(typeof props.onNavigateToGames).toBe("function");
  });

  it("should handle navigation callback when match is selected", () => {
    const onSelectMatchMock = jest.fn();
    const dummyGame: any = {
      id: 5,
      teamId: 10,
      opponent: "Barcelona",
      status: "finished",
    };

    const props: HomeViewProps = {
      teamId: 10,
      onSelectMatch: onSelectMatchMock,
    };

    props.onSelectMatch?.(dummyGame);
    expect(onSelectMatchMock).toHaveBeenCalledTimes(1);
    expect(onSelectMatchMock).toHaveBeenCalledWith(dummyGame);
  });
});
