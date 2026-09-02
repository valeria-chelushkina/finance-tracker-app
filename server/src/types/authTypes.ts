import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  userId: number;
  userEmail: string;
}

export type PasswordHashPair = {
  password: string,
  passwordHash: string,
}

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ResetPasswordBody = {
  oldPassword: string;
  newPassword: string;
};

export type JwtCredentials = {
  token: string,
  secret: string,
}
