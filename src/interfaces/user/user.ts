import type { BaseModelResponse } from "../common/common";

export type User = BaseModelResponse & {
  username: string;
  email: string;
  uuid: string;
  role: "CLIENT" | "ADMIN";
};

export type CreateUser = {
  username: string;
  email: string;
  password: string;
};

export type AuthUser = {
  user: User;
  token: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  token: string;
  newPassword: string;
};
