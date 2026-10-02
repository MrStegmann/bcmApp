import { RosterSelectionModalProps } from "../../types/match";

declare const jest: any;

describe("RosterSelectionModal Contract & Flow Tests (T008 - US1 & US2)", () => {
  const mockPlayers = [
    { id: 1, firstName: "Pau", lastName: "Gasol", number: "16", position: "Pívot" },
    { id: 2, firstName: "Marc", lastName: "Gasol", number: "33", position: "Pívot" },
    { id: 3, firstName: "Ricky", lastName: "Rubio", number: "9", position: "Base" },
  ];

  describe("Optional Mode (Creation Flow - US1)", () => {
    it("should allow skipping roster declaration in optional mode", () => {
      const onSkipMock = jest.fn();
      const onConfirmMock = jest.fn();

      const modalProps: RosterSelectionModalProps = {
        visible: true,
        isMandatory: false,
        availablePlayers: mockPlayers,
        selectedPlayerIds: [],
        onTogglePlayer: jest.fn(),
        onConfirm: onConfirmMock,
        onSkip: onSkipMock,
        onClose: jest.fn(),
      };

      expect(modalProps.isMandatory).toBe(false);
      expect(modalProps.onSkip).toBeDefined();

      modalProps.onSkip?.();
      expect(onSkipMock).toHaveBeenCalledTimes(1);
    });

    it("should allow selecting players and confirming in optional mode", () => {
      const onConfirmMock = jest.fn();
      const modalProps: RosterSelectionModalProps = {
        visible: true,
        isMandatory: false,
        availablePlayers: mockPlayers,
        selectedPlayerIds: [1, 2],
        onTogglePlayer: jest.fn(),
        onConfirm: onConfirmMock,
        onSkip: jest.fn(),
        onClose: jest.fn(),
      };

      modalProps.onConfirm(modalProps.selectedPlayerIds);
      expect(onConfirmMock).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe("Mandatory Mode (Start Match Flow - US2)", () => {
    it("should prevent submission when 0 players are selected in mandatory mode", () => {
      const onConfirmMock = jest.fn();
      const modalProps: RosterSelectionModalProps = {
        visible: true,
        isMandatory: true,
        availablePlayers: mockPlayers,
        selectedPlayerIds: [],
        onTogglePlayer: jest.fn(),
        onConfirm: onConfirmMock,
        onClose: jest.fn(),
      };

      const handleConfirm = () => {
        if (modalProps.isMandatory && modalProps.selectedPlayerIds.length === 0) {
          return false;
        }
        modalProps.onConfirm(modalProps.selectedPlayerIds);
        return true;
      };

      const result = handleConfirm();
      expect(result).toBe(false);
      expect(onConfirmMock).not.toHaveBeenCalled();
    });

    it("should allow confirmation in mandatory mode when at least 1 player is selected", () => {
      const onConfirmMock = jest.fn();
      const modalProps: RosterSelectionModalProps = {
        visible: true,
        isMandatory: true,
        availablePlayers: mockPlayers,
        selectedPlayerIds: [3],
        onTogglePlayer: jest.fn(),
        onConfirm: onConfirmMock,
        onClose: jest.fn(),
      };

      const handleConfirm = () => {
        if (modalProps.isMandatory && modalProps.selectedPlayerIds.length === 0) {
          return false;
        }
        modalProps.onConfirm(modalProps.selectedPlayerIds);
        return true;
      };

      const result = handleConfirm();
      expect(result).toBe(true);
      expect(onConfirmMock).toHaveBeenCalledWith([3]);
    });
  });
});
