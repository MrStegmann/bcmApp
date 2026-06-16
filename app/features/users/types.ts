export type UserRole =
  | "root"
  | "admin"
  | "adminassistant"
  | "coach"
  | "coachassistant"
  | "staff";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type UserFormParams = {
  user?: User;
};
