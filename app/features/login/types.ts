import { UserRole } from "../users/types";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type AuthData = {
  name: string;
  email: string;
  token: string;
  role: UserRole;
  id: string;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export type LoginSubmitHandler = (
  values: LoginFormValues,
) => AuthData | void | Promise<AuthData | void>;
