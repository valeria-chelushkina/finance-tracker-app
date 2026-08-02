import { pgEnum } from "drizzle-orm/pg-core";
// right now it is only monobank, but in plans expand the app and take privatbank information,
// if will not happen - data type will be changed.
export const banksEnum = pgEnum("bank_name", ["monobank"]);

export const paymentTypesEnum = pgEnum("paument_type", ["card", "cash"]);

export const cashbackTypesEnum = pgEnum("cashback_type", ["None", "UAH", "Miles"]);

// 1: transaction happens every * days
// 2: transaction happens on * day of every month
export const frequencyTypesEnum = pgEnum("frequency_type", [
  "number_of_days",
  "date_of_month",
]);

// monobank card types
export const typesEnum = pgEnum("type", [
  "black",
  "white",
  "platinum",
  "iron",
  "fop",
  "yellow",
  "eAid",
]);