import {
  isoCurrencyColumn,
  isoCurrencyCheck,
} from "@server/helpers/dbHelpers.js";
import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  doublePrecision,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { users } from "@server/modules/user/user.module.js";
import {
  BankProviders,
  CashbackTypes,
  CardTypes,
} from "@server/types/dbEnums.js";

export const banksEnum = pgEnum(
  "bank_name",
  Object.values(BankProviders) as [string, ...string[]],
);

export const cashbackTypesEnum = pgEnum(
  "cashback_type",
  Object.values(CashbackTypes) as [string, ...string[]],
);

// monobank card types
export const typesEnum = pgEnum(
  "type",
  Object.values(CardTypes) as [string, ...string[]],
);

export const accounts = pgTable(
  "accounts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bankName: banksEnum().default(BankProviders.Monobank).notNull(),
    sendId: varchar("send_id", { length: 255 }).unique(),
    currencyCode: isoCurrencyColumn(),
    cashbackType: cashbackTypesEnum(),
    balance: doublePrecision(),
    creditLimit: doublePrecision("credit_limit"),
    maskedPan: varchar("masked_pan", { length: 19 })
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    type: typesEnum().default(CardTypes.Black),
    iban: varchar({ length: 34 }),
  },
  (t) => [
    isoCurrencyCheck("accounts"),
    check(
      "cashback_type_card",
      sql`(${t.cashbackType} = 'Miles' AND (${t.type} = 'platinum' OR ${t.type} = 'iron')) OR (${t.cashbackType} <> 'Miles' OR ${t.cashbackType} IS NULL)`,
    ),
  ],
);
