class TeamsFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamsFeatureError";
  }
}

class TeamsFetchError extends TeamsFeatureError {
  constructor(message = "No se pudo cargar la lista de equipos.") {
    super(message);
    this.name = "TeamsFetchError";
  }
}

class TeamDeleteError extends TeamsFeatureError {
  constructor(message = "No se pudo eliminar el equipo. Intentalo de nuevo.") {
    super(message);
    this.name = "TeamDeleteError";
  }
}

class TeamSaveError extends TeamsFeatureError {
  constructor(message = "No se pudo guardar el equipo. Intentalo de nuevo.") {
    super(message);
    this.name = "TeamSaveError";
  }
}

const getTeamsErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof TeamsFeatureError) {
    return error.message;
  }

  return fallbackMessage;
};

export {
  TeamsFeatureError,
  TeamsFetchError,
  TeamSaveError,
  TeamDeleteError,
  getTeamsErrorMessage,
};
