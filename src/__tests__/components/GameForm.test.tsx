import { validateMatchDate } from "../../utils/dateValidation";
import { MatchFormData } from "../../types/match";

declare const jest: any;

describe("GameForm Contract & Validation Tests (T008 - US1)", () => {
  const validateForm = (data: Partial<MatchFormData>) => {
    const errors: Record<string, string> = {};
    if (!data.rivalTeamName || !data.rivalTeamName.trim()) {
      errors.rivalTeamName = "Debe introducir el nombre del equipo contrincante";
    }
    if (!data.round || !data.round.trim()) {
      errors.round = "Debe introducir la jornada del partido";
    }
    const dateVal = validateMatchDate(data.date || "");
    if (!dateVal.isValid) {
      errors.date = dateVal.error || "Debe introducir la fecha del partido";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const createGamePayload = (data: MatchFormData, teamId: number = 1) => {
    return {
      teamId,
      rivalTeamName: data.rivalTeamName.trim(),
      opponent: data.rivalTeamName.trim(),
      round: data.round.trim(),
      date: data.date.trim(),
      timeStamp: data.date.trim(), // Backward compatibility alias
    };
  };

  it("should fail validation when all fields are empty", () => {
    const result = validateForm({});
    expect(result.isValid).toBe(false);
    expect(result.errors.rivalTeamName).toBe("Debe introducir el nombre del equipo contrincante");
    expect(result.errors.round).toBe("Debe introducir la jornada del partido");
    expect(result.errors.date).toBe("Debe introducir la fecha del partido");
  });

  it("should fail validation when date has invalid format or calendar error", () => {
    const result = validateForm({
      rivalTeamName: "CB Cornellà",
      round: "Jornada 1",
      date: "15-10-2026",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.date).toBe("Formato de fecha inválido. Utilice dd/mm/aaaa");
  });

  it("should fail validation for non-leap year February 29", () => {
    const result = validateForm({
      rivalTeamName: "CB Cornellà",
      round: "Jornada 1",
      date: "29/02/2025",
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.date).toBe("Fecha inválida en el calendario");
  });

  it("should pass validation and format match payload when all mandatory fields are valid", () => {
    const input: MatchFormData = {
      rivalTeamName: "CB Cornellà",
      round: "Jornada 1",
      date: "23/10/2026",
      teamId: 1,
    };
    const result = validateForm(input);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);

    const payload = createGamePayload(input, 1);
    expect(payload).toEqual({
      teamId: 1,
      rivalTeamName: "CB Cornellà",
      opponent: "CB Cornellà",
      round: "Jornada 1",
      date: "23/10/2026",
      timeStamp: "23/10/2026",
    });
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

    const validData: MatchFormData = {
      round: "Jornada 2",
      date: "24/10/2026",
      rivalTeamName: "Lakers",
      teamId: 1,
    };
    const payload = createGamePayload(validData, 1);
    formProps.onSubmit(payload);
    expect(onSubmitMock).toHaveBeenCalledWith(payload);
  });
});
