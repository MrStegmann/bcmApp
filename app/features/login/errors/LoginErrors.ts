class LoginFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginFeatureError";
  }
}

class InvalidLoginResponseError extends LoginFeatureError {
  constructor(message = "Respuesta de login invalida") {
    super(message);
    this.name = "InvalidLoginResponseError";
  }
}

class InvalidAutoLoginResponseError extends LoginFeatureError {
  constructor(message = "Respuesta de autologin invalida") {
    super(message);
    this.name = "InvalidAutoLoginResponseError";
  }
}

class TokenValidationError extends LoginFeatureError {
  constructor(message = "No se pudo validar la sesion") {
    super(message);
    this.name = "TokenValidationError";
  }
}

export {
  LoginFeatureError,
  InvalidLoginResponseError,
  InvalidAutoLoginResponseError,
  TokenValidationError,
};
