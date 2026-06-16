import apiClient from "../../../config/apiClient";
import { UserRole } from "../../users/types";
import { AuthData, LoginFormValues } from "../types";
import {
  InvalidAutoLoginResponseError,
  InvalidLoginResponseError,
  TokenValidationError,
} from "../errors";

const isValidResponsePayload = (data: any): boolean => {
  if (typeof data?.valid === "boolean") {
    return data.valid;
  }

  if (typeof data?.isValid === "boolean") {
    return data.isValid;
  }

  return true;
};

const mapAuthData = (data: any, fallbackEmail: string): AuthData | null => {
  const token = data?.token ?? data?.jwt ?? data?.accessToken;
  const email = data?.email ?? data?.user?.email ?? fallbackEmail;
  const name =
    data?.name ??
    data?.user?.name ??
    (typeof email === "string" ? email.split("@")[0] : "Usuario");

  if (!token || !email || !name) {
    return null;
  }

  return {
    name: String(name),
    email: String(email),
    token: String(token),
    role: String(data?.role ?? data?.user?.role ?? "coach") as UserRole,
  };
};

export const loginWithEmailAndPassword = async (
  values: LoginFormValues,
): Promise<AuthData> => {
  const response = await apiClient.post("/auth/login", {
    email: values.email,
    password: values.password,
  });

  const authData = mapAuthData(response?.data, values.email);

  if (!authData) {
    throw new InvalidLoginResponseError();
  }

  return authData;
};

export const autoLoginWithJwtToken = async (
  token: string,
  fallbackEmail = "",
): Promise<AuthData> => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await apiClient.post(
    "/auth/autologin",
    {},
    {
      headers,
    },
  );

  const authData = mapAuthData(
    {
      ...response?.data,
      token: response?.data?.token ?? response?.data?.jwt ?? token,
    },
    fallbackEmail,
  );

  if (!authData) {
    throw new InvalidAutoLoginResponseError();
  }

  return authData;
};

export const validateJwtToken = async (token: string): Promise<boolean> => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const requests: Array<() => Promise<any>> = [
    () => apiClient.get("/auth/verify", { headers }),
    () => apiClient.post("/verify", {}, { headers }),
  ];

  let lastError: unknown = null;

  for (const request of requests) {
    try {
      const response = await request();
      return isValidResponsePayload(response?.data);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    throw new TokenValidationError(lastError.message);
  }

  throw new TokenValidationError();
};
