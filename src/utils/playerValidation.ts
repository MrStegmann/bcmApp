import { PlayerFormData } from "../../specs/013-update-player-details/contracts/player-api";

export interface PlayerFormValidationErrors {
  firstName?: string;
  lastName?: string;
  number?: string;
  jerseyName?: string;
}

export interface PlayerFormValidationResult {
  isValid: boolean;
  errors: PlayerFormValidationErrors;
}

/**
 * Validates player creation and edit form inputs according to feature 013 specs.
 */
export function validatePlayerForm(data: {
  firstName?: string;
  lastName?: string;
  number?: string;
  jerseyName?: string | null;
}): PlayerFormValidationResult {
  const errors: PlayerFormValidationErrors = {};

  const trimmedFirstName = (data.firstName ?? "").trim();
  const trimmedLastName = (data.lastName ?? "").trim();
  const trimmedNumber = (data.number ?? "").trim();
  const trimmedJerseyName = data.jerseyName != null ? data.jerseyName.trim() : "";

  if (trimmedFirstName.length === 0) {
    errors.firstName = "Debes introducir un nombre.";
  }

  if (trimmedLastName.length === 0) {
    errors.lastName = "Debes introducir un apellido.";
  }

  if (trimmedNumber.length === 0) {
    errors.number = "Debes introducir un número.";
  } else if (isNaN(Number(trimmedNumber))) {
    errors.number = "Debes introducir un número.";
  }

  if (trimmedJerseyName.length > 30) {
    errors.jerseyName = "El nombre en camiseta no puede exceder 30 caracteres.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Normalizes input data into the persistence contract payload,
 * omitting position and notes, and storing empty jerseyName as null.
 */
export function createPlayerPayload(
  data: {
    teamId: number;
    firstName: string;
    lastName: string;
    number: string;
    jerseyName?: string | null;
  },
  id?: number
): PlayerFormData {
  const trimmedJerseyName = data.jerseyName != null ? data.jerseyName.trim() : "";

  return {
    id,
    teamId: data.teamId,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    number: data.number.trim(),
    jerseyName: trimmedJerseyName.length > 0 ? trimmedJerseyName : null,
  };
}
