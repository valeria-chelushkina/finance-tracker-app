import { AppError } from "@server/errors/AppError.js";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Handle custom application errors (NotFoundError, ValidationError, etc.)
  if (err instanceof AppError) {
    res.status(err.status).json({
      status: "error",
      statusCode: err.status,
      message: err.message,
    });
    return;
  }

  // 2. Handle specific database/ORM errors (like Drizzle's "No values to set")
  if (err.message === "No values to set") {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "No values to set for update.",
    });
    return;
  }

  // 3. Fallback for unhandled/internal server errors
  console.error("Unhandled error occurred:", err);

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: err.message || "An unexpected error occurred.",
  });
};
