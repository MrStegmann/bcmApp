import {
  validatePlayerForm,
  createPlayerPayload,
} from "../../utils/playerValidation";

declare const jest: any;

describe("PlayerForm Contract & Validation Tests (T009 - US1)", () => {
  const teamId = 10;

  it("fails validation when required fields (firstName, lastName, number) are empty", () => {
    const result = validatePlayerForm({
      firstName: "",
      lastName: "",
      number: "",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toBe("Debes introducir un nombre.");
    expect(result.errors.lastName).toBe("Debes introducir un apellido.");
    expect(result.errors.number).toBe("Debes introducir un número.");
  });

  it("fails validation when jersey number is not numeric", () => {
    const result = validatePlayerForm({
      firstName: "Luka",
      lastName: "Doncic",
      number: "abc",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.number).toBe("Debes introducir un número.");
  });

  it("passes validation when optional jerseyName is omitted or empty", () => {
    const result = validatePlayerForm({
      firstName: "Michael",
      lastName: "Jordan",
      number: "23",
      jerseyName: "",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors.firstName).toBeUndefined();
    expect(result.errors.lastName).toBeUndefined();
    expect(result.errors.number).toBeUndefined();
    expect(result.errors.jerseyName).toBeUndefined();
  });

  it("passes validation when optional jerseyName is provided", () => {
    const result = validatePlayerForm({
      firstName: "Michael",
      lastName: "Jordan",
      number: "23",
      jerseyName: "M. JORDAN",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("fails validation if jerseyName exceeds 30 characters", () => {
    const result = validatePlayerForm({
      firstName: "Michael",
      lastName: "Jordan",
      number: "23",
      jerseyName: "A".repeat(31),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.jerseyName).toBe("El nombre en camiseta no puede exceder 30 caracteres.");
  });

  it("creates payload omitting position and notes and setting jerseyName correctly", () => {
    const payload = createPlayerPayload({
      teamId,
      firstName: "Pau",
      lastName: "Gasol",
      number: "16",
      jerseyName: "P. GASOL",
    });

    expect(payload).toEqual({
      teamId: 10,
      firstName: "Pau",
      lastName: "Gasol",
      number: "16",
      jerseyName: "P. GASOL",
      id: undefined,
    });
    expect((payload as any).position).toBeUndefined();
    expect((payload as any).notes).toBeUndefined();
  });

  it("creates payload with null jerseyName when jerseyName is empty string or omitted", () => {
    const payload = createPlayerPayload({
      teamId,
      firstName: "Marc",
      lastName: "Gasol",
      number: "33",
      jerseyName: "   ",
    });

    expect(payload.jerseyName).toBeNull();
  });

  it("creates update payload with player id when editing an existing player", () => {
    const existingPlayer = {
      id: 44,
      teamId: 10,
      firstName: "Geronimo",
      lastName: "Sanchez",
      number: "44",
      jerseyName: "G. SANCHEZ",
    };

    const payload = createPlayerPayload(
      {
        teamId: 10,
        firstName: "Geronimo",
        lastName: "Sanchez",
        number: "44",
        jerseyName: "SANCHEZ",
      },
      existingPlayer.id
    );

    expect(payload.id).toBe(44);
    expect(payload.jerseyName).toBe("SANCHEZ");
  });
});
