import { Request, Response, NextFunction } from "express";
import { AuthService } from "@server/modules/auth/auth.service.js";
import { AuthError } from "@server/errors/AppError.js";
import { UserPayload } from "@server/types/authTypes.js";

const authService = new AuthService();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new AuthError("Access token is absent in request.");
  }
  const decodedUser: UserPayload = authService.verifyToken(
    accessToken,
    "JWT_ACCESS_SECRET",
  ); // verifytoken catches errors, so if AT is invalid, expired etc => will throw 401 error

  res.locals.user = decodedUser; // save user information, saved in token
  next();
};
