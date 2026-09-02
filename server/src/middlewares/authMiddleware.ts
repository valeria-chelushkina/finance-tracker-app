import { Request, Response, NextFunction } from "express";
import { AuthService } from "@server/modules/auth/auth.service.js";
import { AuthError } from "@server/errors/AppError.js";
import { UserPayload } from "@server/types/authTypes.js";
import { clearCookie } from "@server/utils/cookiesUtils.js";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import jwt from "jsonwebtoken";

const authService = new AuthService();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken: string = req.cookies.accessToken;
  if (!accessToken) {
    throw new AuthError("Access token is absent in request.");
  }
  try {
    const decodedUser: UserPayload = authService.verifyToken(
      accessToken,
      getEnvOrThrow("JWT_ACCESS_SECRET"),
    ); // verifytoken catches errors, so if AT is invalid, expired etc => will throw 401 error

    res.locals.user = decodedUser; // save user information, saved in token
    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      clearCookie(res, "accessToken"); // clears accessToken cookies if token is expired
    }
    next(err);
  }
};
