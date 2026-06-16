class GamesFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GamesFeatureError";
  }
}

class GamesFetchError extends GamesFeatureError {
  constructor(message = "No se pudo cargar la lista de games.") {
    super(message);
    this.name = "GamesFetchError";
  }
}

class GamesDeleteError extends GamesFeatureError {
  constructor(message = "No se pudo eliminar el game. Intentalo de nuevo.") {
    super(message);
    this.name = "GamesDeleteError";
  }
}

class GamesSaveError extends GamesFeatureError {
  constructor(message = "No se pudo guardar el game. Intentalo de nuevo.") {
    super(message);
    this.name = "GamesSaveError";
  }
}

const getGamesErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof GamesFeatureError) {
    return error.message;
  }

  return fallbackMessage;
};

export {
  GamesFeatureError,
  GamesFetchError,
  GamesSaveError,
  GamesDeleteError,
  getGamesErrorMessage,
};
