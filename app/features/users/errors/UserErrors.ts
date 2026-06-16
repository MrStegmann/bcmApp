class UsersFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsersFeatureError";
  }
}

class UsersFetchError extends UsersFeatureError {
  constructor(message = "No se pudo cargar la lista de usuarios.") {
    super(message);
    this.name = "UsersFetchError";
  }
}

class UserSaveError extends UsersFeatureError {
  constructor(message = "No se pudo guardar el usuario. Intentalo de nuevo.") {
    super(message);
    this.name = "UserSaveError";
  }
}

class UserDeleteError extends UsersFeatureError {
  constructor(message = "No se pudo eliminar el usuario. Intentalo de nuevo.") {
    super(message);
    this.name = "UserDeleteError";
  }
}

class UserPromoteError extends UsersFeatureError {
  constructor(message = "No se pudo promover el usuario a root.") {
    super(message);
    this.name = "UserPromoteError";
  }
}

const getUsersErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof UsersFeatureError) {
    return error.message;
  }

  return fallbackMessage;
};

export {
  UsersFeatureError,
  UsersFetchError,
  UserSaveError,
  UserDeleteError,
  UserPromoteError,
  getUsersErrorMessage,
};
