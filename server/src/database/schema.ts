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
  date,
  boolean,
  jsonb,
  text,
  check,
} from "drizzle-orm/pg-core";

// right now it is only monobank, but in plans expand the app and take privatbank information,
// if will not happen - data type will be changed.
const banksEnum = pgEnum("banks", ["monobank"]);

const paymentTypesEnum = pgEnum("payments", ["card", "cash"]);

// 1: transaction happens every * days
// 2: transaction happens on * day of every month
const frequencyTypesEnum = pgEnum("frequency_types", [
  "number_of_days",
  "date_of_month",
]);

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
  profilePicture: text(), //??
  bankToken: varchar("bank_token", { length: 255 }).unique(),
  expectedSalary: doublePrecision("expected_salary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
}, (t) => [
  check("salary_check", sql`${t.expectedSalary} > 0`)
]);

export const accountsTable = pgTable("accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  bankName: banksEnum("bank_name").default("monobank").notNull(),
  cardId: varchar("card_id", { length: 255 }).unique(),
  sendId: varchar("send_id", { length: 255 }).unique(),
  currencyCode: integer("currency_code").default(980),
  cashbackType: varchar("cashback_type", { length: 10 }),
  balance: doublePrecision(),
  creditLimit: doublePrecision("credit_limit"),
  maskedPan: varchar("masked_pan", { length: 19 })
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  type: typesEnum().default("black").notNull(),
  iban: varchar({ length: 34 }),
}, (t) => [
  check('currency_code_boundaries_accounts', sql`${t.currencyCode} > 7 AND ${t.currencyCode} < 998`)
]);

// only successful transactions - if transaction didn't go through, it will not be saved
// transactions made with cash would also be saved here (user will enter manualy)
export const transactionsTable = pgTable("transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  paymentType: paymentTypesEnum("paument_type").default("card"),
  accountId: integer("account_id").references(() => accountsTable.id, {
    onDelete: "cascade",
  }),
  transactionId: varchar("transaction_id", { length: 255 }).unique(),
  transactionTime: timestamp("transaction_time"),
  description: varchar({ length: 255 }),
  //category
  amount: doublePrecision().notNull(), // commision will be included (if they exist)
  currencyCode: integer("currency_code").default(980),
  commissionRate: doublePrecision("commission_rate"),
  cashbackAmout: doublePrecision("cashback_amount"),
  comment: varchar({ length: 255 }),
}, (t) => [
  check('currency_code_boundaries_transactions', sql`${t.currencyCode} > 7 AND ${t.currencyCode} < 998`)
]);

export const recurringTransactionsTable = pgTable("recurring_transactions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(),
  amount: doublePrecision().notNull(),
  currencyCode: integer("currency_code").default(980),
  nextDueDate: date("next_due_date"),
  fruequencyType:
    frequencyTypesEnum("frequency_type").default("number_of_days"),
  frequency: integer().notNull(),
  isActive: boolean("is_active").default(true),
}, (t) => [
  check('currency_code_boundaries_recur_transactions', sql`${t.currencyCode} > 7 AND ${t.currencyCode} < 998`)
]);

export const budgetsTable = pgTable("budgets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  category: varchar({ length: 255 }),
  items: jsonb(), // if inside category there are specific item with specific prices
  limitAmount: doublePrecision("limit_amount"),
  month: integer(),
  year: integer(),
});

export const jarsTable = pgTable("jars", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  jarId: varchar("jar_id").notNull().unique(),
  sendId: varchar("send_id").notNull().unique(),
  title: varchar({ length: 255 }),
  description: varchar("length: 255"),
  currencyCode: integer("currency_code").default(980),
  balance: doublePrecision(),
  goal: doublePrecision(),
}, (t) => [
  check('currency_code_boundaries_jars', sql`${t.currencyCode} > 7 AND ${t.currencyCode} < 998`)
]);

export const wishlistsTable = pgTable("wishlists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }),
  amount: doublePrecision(),
  currencyCode: integer("currency_code").default(980),
  url: text(),
  // category
}, (t) => [
  check('currency_code_boundaries_wishlistts', sql`${t.currencyCode} > 7 AND ${t.currencyCode} < 998`)
]);

export const statisticsTable = pgTable("statistics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  categories: jsonb(),
  month: integer(),
  year: integer(),
  amount: doublePrecision(),
  currencyCode: integer("currency_code").default(980),
}, (t) => [
  check('currency_code_boundaries_statistics', sql`${t.currencyCode} > 7 AND ${t.currencyCode} < 998`)
]);

// need to create categories table based on mccs