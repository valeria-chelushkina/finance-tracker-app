// Database tables
// Some tables, as for now, are built to fit monobank api

import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

// right now it is only monobank, but in plans expand the app and take privatbank information,
// if will not happen - data type will be changed.
const banksEnum = pgEnum("banks", ["monobank"]);

// monobank card types
const typesEnum = pgEnum("types", [
  "black",
  "white",
  "platinum",
  "iron",
  "fop",
  "yellow",
  "eAid",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar({ length: 255 }),
  bankToken: varchar("bank_token", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const accountsTable = pgTable("accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  bankName: banksEnum("bank_name").default("monobank").notNull(),
  cardId: varchar("card_id", { length: 255 }).unique(),
  sendId: varchar("send_id", { length: 255 }).unique(),
  currencyCode: integer("currency_code"),
  cashbackType: varchar("cashback_type", { length: 10 }),
  balance: doublePrecision(),
  creditLimit: doublePrecision("credit_limit"),
  maskedPan: varchar("masked_pan", { length: 19 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  type: typesEnum().default("black").notNull(),
  iban: varchar({ length: 34 }),
});

