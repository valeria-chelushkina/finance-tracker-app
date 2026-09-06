import { integer, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { VALID_ISO_NUMS } from "@server/helpers/currencyHelpers.js";
import { ValidationError } from "@server/errors/AppErrors.js";

export const isoCurrencyColumn = (name = "currency_code") =>
  integer(name).default(980);

export const isoCurrencyCheck = (
  tableName: string,
  colName = "currency_code",
) =>
  check(
    `${tableName}_${colName}_check`,
    sql`${sql.identifier(colName)} IN ${VALID_ISO_NUMS}`,
  );

// when user wants to choose a date for budget - it will validate the date
export function validateBudgetCreation(year: number, month: number) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear) {
    throw new Error("Cannot budget for a past year.");
  }

  if (year === currentYear && month < currentMonth) {
    throw new ValidationError(
      "Cannot budget for past months in the current year.",
    );
  }
}
