import { AppError } from "@server/errors/AppError.js";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  if (err instanceof AppError) {
    res.status(err.status).json({
      status: "error",
      statusCode: err.status,
      message: err.message,
    });
    return;
  }

  if (err.message === "No values to set") {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "No values to set for update.",
    });
    return;
  }

  console.error("Unhandled error occurred:", err);

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: err.message || "An unexpected error occurred.",
  });
};
