import { integer, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import * as data from "@server/config/currencies.json" with { type: "json" };
import { ValidationError } from "@server/errors/AppErrors.js";

// get all ISO numbers from json file (maybe will improve and get not only ISO but also other values)
const validIsoNums = Object.values(data.default)
  .map((c) => c.ISOnum)
  .filter((num): num is number => num !== null);

export const isoCurrencyColumn = (name = "currency_code") =>
  integer(name).default(980);

export const isoCurrencyCheck = (
  tableName: string,
  colName = "currency_code",
) =>
  check(
    `${tableName}_${colName}_check`,
    sql`${sql.identifier(colName)} IN ${validIsoNums}`,
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
