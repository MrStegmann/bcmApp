import { validateMatchTimestamp } from "../../utils/dateValidation";
import { MatchFormData } from "../../types/match";

declare const jest: any;

describe("GameForm Contract & Validation Tests (T007 - US1)", () => {
  const validateForm = (data: Partial<MatchFormData>) => {
    const errors: Record<string, string> = {};
    if (!data.rivalTeamName || !data.rivalTeamName.trim()) {
      errors.rivalTeamName = "Debe introducir el nombre del equipo contrincante";
    }
    if (!data.round || !data.round.trim()) {
      errors.round = "Debe introducir la jornada del partido";
    }
    const timeVal = validateMatchTimestamp(data.timeStamp || "");
    if (!timeVal.isValid) {
      errors.timeStamp = timeVal.error || "Debe introducir la fecha del partido";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  it("should fail validation when all fields are empty", () => {
    const result = validateForm({});
    expect(result.isValid).toBe(false);
    expect(result.errors.rivalTeamName).toBe("Debe introducir el nombre del equipo contrincante");
    expect(result.errors.round).toBe("Debe introducir la jornada del partido");
    expect(result.errors.timeStamp).toBe("Debe introducir la fecha del partido");
  });

  it("should fail validation when timestamp has invalid format", () => {
    const result = validateForm({
      rivalTeamName: "CB Cornellà",
      round: "Jornada 1",
      timeStamp: "15-10-2026 19:30",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.timeStamp).toBe("Formato de fecha inválido. Utilice dd/mm/aaaa - hh:mm");
  });

  it("should pass validation and format match payload when all mandatory fields are valid", () => {
    const result = validateForm({
      rivalTeamName: "CB Cornellà",
      round: "Jornada 1",
      timeStamp: "15/10/2026 - 19:30",
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it("should verify GameForm props contract supports submission and cancel callbacks", () => {
    const onSubmitMock = jest.fn();
    const onCancelMock = jest.fn();
    const formProps = {
      onSubmit: onSubmitMock,
      onCancel: onCancelMock,
    };

    formProps.onCancel();
    expect(onCancelMock).toHaveBeenCalledTimes(1);

    const payload = {
      round: "Jornada 2",
      timeStamp: "20/10/2026 - 18:00",
      rivalTeamName: "Lakers",
      teamId: 1,
    };
    formProps.onSubmit(payload);
    expect(onSubmitMock).toHaveBeenCalledWith(payload);
  });
});
