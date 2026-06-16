import { LoginFormErrors, LoginFormValues } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmpty = (value: string): boolean => value.trim().length === 0;

export const isValidEmail = (email: string): boolean =>
  EMAIL_REGEX.test(email.trim());

export const validateLoginForm = (values: LoginFormValues): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (isEmpty(values.email)) {
    errors.email = "El email es obligatorio.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "El formato del email no es valido.";
  }

  if (isEmpty(values.password)) {
    errors.password = "La contrasena es obligatoria.";
  }

  return errors;
};
