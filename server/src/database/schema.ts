// Database tables
// Some tables, as for now, are built to fit monobank api

import {
  isoCurrencyColumn,
  isoCurrencyCheck,
} from "@server/helpers/db-helpers.js";
import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  doublePrecision,
  pgEnum,
  date,
  boolean,
  jsonb,
  text,
  check,
  unique,
} from "drizzle-orm/pg-core";

// right now it is only monobank, but in plans expand the app and take privatbank information,
// if will not happen - data type will be changed.
const banksEnum = pgEnum("bank_name", ["monobank"]);

const paymentTypesEnum = pgEnum("paument_type", ["card", "cash"]);

const cashbackTypesEnum = pgEnum("cashback_type", ["None", "UAH", "Miles"]);

// 1: transaction happens every * days
// 2: transaction happens on * day of every month
const frequencyTypesEnum = pgEnum("frequency_type", [
  "number_of_days",
  "date_of_month",
]);

// monobank card types
const typesEnum = pgEnum("type", [
  "black",
  "white",
  "platinum",
  "iron",
  "fop",
  "yellow",
  "eAid",
]);

export const usersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    name: varchar({ length: 255 }),
    profilePicture: text(), //??
    bankToken: varchar("bank_token", { length: 255 }).unique(),
    expectedSalary: doublePrecision("expected_salary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (t) => [check("salary_check", sql`${t.expectedSalary} > 0`)],
);

export const accountsTable = pgTable(
  "accounts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    bankName: banksEnum().default("monobank").notNull(),
    cardId: varchar("card_id", { length: 255 }).unique(),
    sendId: varchar("send_id", { length: 255 }).unique(),
    currencyCode: isoCurrencyColumn(),
    cashbackType: cashbackTypesEnum(),
    balance: doublePrecision(),
    creditLimit: doublePrecision("credit_limit"),
    maskedPan: varchar("masked_pan", { length: 19 })
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    type: typesEnum().default("black").notNull(),
    iban: varchar({ length: 34 }),
  },
  (t) => [
    isoCurrencyCheck("accounts"),
    check(
      "cashback_type_card",
      sql`(${t.cashbackType} = Miles AND (${t.type} = platinum OR ${t.type} = iron)) OR (${t.cashbackType} <> Miles OR ${t.cashbackType} IS NULL)`,
    ),
  ],
);

// only successful transactions - if transaction didn't go through, it will not be saved
// transactions made with cash would also be saved here (user will enter manualy)
export const transactionsTable = pgTable(
  "transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    paymentType: paymentTypesEnum().default("card"),
    accountId: integer("account_id").references(() => accountsTable.id, {
      onDelete: "cascade",
    }),
    transactionId: varchar("transaction_id", { length: 255 }).unique(),
    transactionTime: timestamp("transaction_time"),
    description: varchar({ length: 255 }),
    //category
    amount: doublePrecision().notNull(), // commision will be included (if they exist)
    currencyCode: isoCurrencyColumn(),
    commissionRate: doublePrecision("commission_rate"),
    cashbackAmout: doublePrecision("cashback_amount"),
    comment: varchar({ length: 255 }),
  },
  () => [isoCurrencyCheck("transactions")],
);

export const recurringTransactionsTable = pgTable(
  "recurring_transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull().unique(), // to prevent same name
    amount: doublePrecision().notNull(),
    currencyCode: isoCurrencyColumn(),
    nextDueDate: date("next_due_date"),
    fruequencyType: frequencyTypesEnum().default("number_of_days"),
    frequency: integer().notNull(),
    isActive: boolean("is_active").default(true),
  },
  () => [isoCurrencyCheck("recurring_transactions")],
);

export const budgetsTable = pgTable(
  "budgets",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    category: varchar({ length: 255 }),
    items: jsonb(),
    limitAmount: doublePrecision("limit_amount"),
    month: integer(),
    year: integer().notNull(),
  },
  (t) => [
    check("month_budget_check", sql`${t.month} BETWEEN 1 AND 12`),
    check("limit_amount_check", sql`${t.limitAmount} >= 0`),
    unique("unique_budget").on(t.category, t.month, t.year),
  ],
);

export const jarsTable = pgTable(
  "jars",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    jarId: varchar("jar_id").notNull().unique(),
    sendId: varchar("send_id").notNull().unique(),
    title: varchar({ length: 255 }),
    description: varchar("length: 255"),
    currencyCode: isoCurrencyColumn(),
    balance: doublePrecision(),
    goal: doublePrecision(),
  },
  () => [isoCurrencyCheck("jars")],
);

export const wishlistsTable = pgTable(
  "wishlists",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }),
    amount: doublePrecision(),
    currencyCode: isoCurrencyColumn(),
    url: text(),
    // category
  },
  (t) => [
    isoCurrencyCheck("wishlists"),
    unique("unique_wishlist_item").on(t.name, t.amount, t.url),
  ],
);

export const statisticsTable = pgTable(
  "statistics",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    categories: jsonb(),
    month: integer(),
    year: integer(),
    amount: doublePrecision(),
    currencyCode: isoCurrencyColumn(),
  },
  (t) => [
    isoCurrencyCheck("statistics"),
    check("month_statistics_check", sql`${t.month} BETWEEN 1 AND 12`),
  ],
);

// need to create categories table based on mccs
