import { CookieOptions } from "express";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";

export const TOKEN_AGES = {
  ACCESS_TOKEN_AGE: 10 * 60 * 1000,
  REFRESH_TOKEN_AGE: 3 * 30 * 24 * 60 * 60 * 1000,
};
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};
export const JWT_SECRET_NAMES = {
  ACCESS_TOKEN: "JWT_ACCESS_SECRET",
  REFRESH_TOKEN: "JWT_REFRESH_SECRET",
};

const generalCookieOptions: CookieOptions = {
    httpOnly: true,
  secure: getEnvOrThrow("NODE_ENV") === "production",
  sameSite: getEnvOrThrow("NODE_ENV") === "production" ? "lax" : "strict",
}

export const cookieAccessOptions: CookieOptions = {
  maxAge: TOKEN_AGES.ACCESS_TOKEN_AGE,
  ...generalCookieOptions,
};

export const cookieRefreshOptions: CookieOptions = {
  maxAge: TOKEN_AGES.REFRESH_TOKEN_AGE,
  ...generalCookieOptions,
};
