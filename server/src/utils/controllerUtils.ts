import { Request } from "express";
import { ValidationError } from "@server/errors/AppErrors.js";

export function stringToIntCheck(req: Request, param: string) {
  const rawParam = req.params[param];

  if (typeof rawParam !== "string") {
    throw new ValidationError(
      `Parameter ${param} is incorrect.`,
    );
  }

  const result: number = parseInt(rawParam, 10);

  if (isNaN(result) || !result) {
    throw new ValidationError(
      `Parameter ${param} is absent or is not a number.`,
    );
  }

  return result;
}
