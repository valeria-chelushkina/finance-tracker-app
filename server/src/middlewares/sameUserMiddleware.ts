import { Request, Response, NextFunction } from "express";
import { AuthError } from "@server/errors/AppError.js";
import { UserPayload } from "@server/types/authTypes.js";

export const sameUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authenticatedUser: UserPayload = res.locals?.user;
  const requestedUserId: number = Number(req.params.id);
  if (
    !authenticatedUser ||
    !requestedUserId ||
    authenticatedUser.userId !== requestedUserId
  ) {
    throw new AuthError("You are not authorized to access this resource.");
  }
  next();
};
