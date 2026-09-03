import { Request, Response, NextFunction } from "express";
import { AuthService } from "@server/modules/auth/auth.service.js";
import { AuthError } from "@server/errors/AppErrors.js";
import type { UserPayload } from "@server/types/generalTypes.js";
import {
  JWT_SECRET_NAMES,
  COOKIE_NAMES,
  cookieAccessOptions,
} from "@server/modules/auth/constants.js";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken: string = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
  if (!accessToken) {
    throw new AuthError("Access token is absent in request.");
  }
  try {
    const decodedUser: UserPayload = authService.verifyToken({
      token: accessToken,
      secret: getEnvOrThrow(JWT_SECRET_NAMES.ACCESS_TOKEN),
    });

    req.user! = decodedUser;

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieAccessOptions);
    }
    next(err);
  }
};
