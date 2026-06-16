class PlayersFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlayersFeatureError";
  }
}

class PlayersFetchError extends PlayersFeatureError {
  constructor(message = "No se pudo obtener la lista de jugadores.") {
    super(message);
    this.name = "PlayersFetchError";
  }
}

class PlayerSaveError extends PlayersFeatureError {
  constructor(message = "No se pudo guardar el jugador. Intentalo de nuevo.") {
    super(message);
    this.name = "PlayerSaveError";
  }
}

class PlayerDeleteError extends PlayersFeatureError {
  constructor(message = "No se pudo eliminar el jugador. Intentalo de nuevo.") {
    super(message);
    this.name = "PlayerDeleteError";
  }
}

const PLAYER_ERROR_TITLES = {
  LOAD_LIST: "Error al cargar jugadores",
  SAVE: "Error al guardar jugador",
  DELETE: "Error al eliminar jugador",
} as const;

const PLAYER_ERRORS = {
  FIRST_NAME_REQUIRED: "El nombre es obligatorio",
  LAST_NAME_REQUIRED: "El apellido es obligatorio",
  BIRTHDAY_REQUIRED: "La fecha de nacimiento es obligatoria",
  JERSEY_NUMBER_INVALID: "El numero de camiseta debe ser mayor a 0",
  LOAD_LIST_FALLBACK:
    "No se pudo obtener la lista de jugadores. Intenta nuevamente.",
  SAVE_FALLBACK: "No se pudo guardar el jugador. Intentalo de nuevo.",
  DELETE_FALLBACK: "No se pudo eliminar el jugador. Intentalo de nuevo.",
} as const;

const getPlayersErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof PlayersFeatureError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

export {
  PlayersFeatureError,
  PlayersFetchError,
  PlayerSaveError,
  PlayerDeleteError,
  PLAYER_ERROR_TITLES,
  PLAYER_ERRORS,
  getPlayersErrorMessage,
};
