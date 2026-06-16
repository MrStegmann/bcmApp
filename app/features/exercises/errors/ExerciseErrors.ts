class ExercisesFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExercisesFeatureError";
  }
}

class ExercisesFetchError extends ExercisesFeatureError {
  constructor(message = "No se pudo cargar la lista de Exercises.") {
    super(message);
    this.name = "ExercisesFetchError";
  }
}

class ExercisesDeleteError extends ExercisesFeatureError {
  constructor(message = "No se pudo eliminar el Exercise. Intentalo de nuevo.") {
    super(message);
    this.name = "ExercisesDeleteError";
  }
}

class ExercisesSaveError extends ExercisesFeatureError {
  constructor(message = "No se pudo guardar el Exercise. Intentalo de nuevo.") {
    super(message);
    this.name = "ExercisesSaveError";
  }
}

const getExercisesErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof ExercisesFeatureError) {
    return error.message;
  }

  return fallbackMessage;
};

export {
  ExercisesFeatureError,
  ExercisesFetchError,
  ExercisesSaveError,
  ExercisesDeleteError,
  getExercisesErrorMessage,
};
