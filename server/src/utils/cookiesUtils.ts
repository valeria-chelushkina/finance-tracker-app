import { Response } from "express";
import {getEnvOrThrow} from '@server/utils/getEnvOrThrow.js';

export const setCookie = (
  res: Response,
  name: string,
  value: string | null,
  options?: {
    ageInSeconds?: number;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  },
): void => {
  const {
    ageInSeconds = 86400, // 1 day
    secure = getEnvOrThrow("NODE_ENV") === 'production',
    httpOnly = true,
    sameSite = 'lax',
  } = options || {};

  res.cookie(name, value, {
    maxAge: ageInSeconds * 1000,
    secure,
    httpOnly,
    sameSite,
  });
};

export const clearCookie = (
  res: Response,
  name: string,
  options?: {
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  },
): void => {
  const {
    secure = getEnvOrThrow("NODE_ENV") === 'production',
    httpOnly = true,
    sameSite = 'lax',
  } = options || {};

  res.clearCookie(name, {
    secure,
    httpOnly,
    sameSite,
  });
};
