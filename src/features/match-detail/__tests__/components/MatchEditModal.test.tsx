import { MatchEditModalProps, MatchEditBuffer, PlayerRosterItem } from "../../types";
import { Game } from "../../../../types/database";

declare const jest: any;

describe("MatchEditModal Component Contract (T029 - US4)", () => {
  const mockMatch: Game = {
    id: 1,
    teamId: 10,
    opponent: "Real Madrid",
    round: "5",
    date: "22/10/2026 - 18:00",
    status: "finished",
    createdAt: "2026-10-22T10:00:00.000Z",
    resultC1: 20,
    resultC2: 18,
    resultC3: 22,
    resultC4: 25,
    resultExtra: 0,
    resultC1Opponent: 19,
    resultC2Opponent: 20,
    resultC3Opponent: 15,
    resultC4Opponent: 22,
    resultExtraOpponent: 0,
    foulsC1: 4,
    foulsC2: 3,
    foulsC3: 5,
    foulsC4: 4,
    foulsExtra: 0,
    foulsC1Opponent: 3,
    foulsC2Opponent: 4,
    foulsC3Opponent: 2,
    foulsC4Opponent: 5,
    foulsExtraOpponent: 0,
  };

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
  ];

  it("should trigger onCancel callback when user cancels edits", () => {
    const onCancelMock = jest.fn();
    const props: MatchEditModalProps = {
      visible: true,
      initialMatch: mockMatch,
      initialPlayers: samplePlayers,
      onSave: jest.fn(),
      onCancel: onCancelMock,
      isSaving: false,
    };

    props.onCancel();
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("should dispatch updated MatchEditBuffer on onSave", async () => {
    const onSaveMock = jest.fn().mockResolvedValue(undefined);
    const props: MatchEditModalProps = {
      visible: true,
      initialMatch: mockMatch,
      initialPlayers: samplePlayers,
      onSave: onSaveMock,
      onCancel: jest.fn(),
      isSaving: false,
    };

    const updatedBuffer: MatchEditBuffer = {
      periods: {
        q1: { teamPoints: 22, teamFouls: 4, rivalPoints: 19, rivalFouls: 3 },
        q2: { teamPoints: 18, teamFouls: 3, rivalPoints: 20, rivalFouls: 4 },
        q3: { teamPoints: 22, teamFouls: 5, rivalPoints: 15, rivalFouls: 2 },
        q4: { teamPoints: 25, teamFouls: 4, rivalPoints: 22, rivalFouls: 5 },
        extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      },
      players: {
        1: {
          minutes: 36,
          t1a: 6,
          t1i: 7,
          t2a: 8,
          t2i: 12,
          t3a: 4,
          t3i: 8,
          oreb: 2,
          dreb: 7,
          asis: 9,
          rec: 2,
          per: 3,
          falt: 2,
        },
      },
    };

    await props.onSave(updatedBuffer);
    expect(onSaveMock).toHaveBeenCalledWith(updatedBuffer);
  });

  it("should support seconds in player roster and buffer edits", async () => {
    const onSaveMock = jest.fn().mockResolvedValue(undefined);
    const playerWithSeconds: PlayerRosterItem = {
      ...samplePlayers[0],
      minutes: 20,
      seconds: 30,
    };
    const props: MatchEditModalProps = {
      visible: true,
      initialMatch: mockMatch,
      initialPlayers: [playerWithSeconds],
      onSave: onSaveMock,
      onCancel: jest.fn(),
      isSaving: false,
    };

    expect(props.initialPlayers[0].seconds).toBe(30);

    const updatedBuffer: MatchEditBuffer = {
      periods: {
        q1: { teamPoints: 10, teamFouls: 1, rivalPoints: 10, rivalFouls: 1 },
        q2: { teamPoints: 10, teamFouls: 1, rivalPoints: 10, rivalFouls: 1 },
        q3: { teamPoints: 10, teamFouls: 1, rivalPoints: 10, rivalFouls: 1 },
        q4: { teamPoints: 10, teamFouls: 1, rivalPoints: 10, rivalFouls: 1 },
        extra: { teamPoints: 0, teamFouls: 0, rivalPoints: 0, rivalFouls: 0 },
      },
      players: {
        1: {
          minutes: 22,
          seconds: 45,
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
        },
      },
    };

    await props.onSave(updatedBuffer);
    expect(onSaveMock).toHaveBeenCalledWith(updatedBuffer);
    expect(updatedBuffer.players[1].seconds).toBe(45);
  });

  it("should enforce KeyboardAwareScrollView configuration with Android support and extra scroll height", () => {
    const fs = require("fs");
    const path = require("path");
    const fileContent = fs.readFileSync(
      path.resolve(__dirname, "../../components/MatchEditModal.tsx"),
      "utf-8"
    );

    expect(fileContent).toContain(
      'import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";'
    );
    expect(fileContent).toContain("<KeyboardAwareScrollView");
    expect(fileContent).toContain("enableOnAndroid={true}");
    expect(fileContent).toContain("extraScrollHeight={120}");
    expect(fileContent).toContain('keyboardShouldPersistTaps="handled"');
    expect(fileContent).toContain("</KeyboardAwareScrollView>");
  });

  it("should configure full-screen SafeAreaView layout without collapsed bottom sheet constraints", () => {
    const fs = require("fs");
    const path = require("path");
    const fileContent = fs.readFileSync(
      path.resolve(__dirname, "../../components/MatchEditModal.tsx"),
      "utf-8"
    );

    // Full screen safe area view
    expect(fileContent).toContain('import { SafeAreaView } from "react-native-safe-area-context";');
    expect(fileContent).toContain('<SafeAreaView className="flex-1 bg-surface-container">');
    expect(fileContent).toContain("transparent={false}");

    // Should NOT have collapsed bottom sheet classes
    expect(fileContent).not.toContain("max-h-[90%]");
    expect(fileContent).not.toContain("justify-end");
  });
});

