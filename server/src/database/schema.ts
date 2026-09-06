import {
  isoCurrencyColumn,
  isoCurrencyCheck,
} from "@server/helpers/dbHelpers.js";
import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  doublePrecision,
  date,
  pgEnum,
  boolean,
  jsonb,
  text,
  check,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "@server/modules/user/user.module.js";
import { accounts } from "@server/modules/account/account.module.js";
import {
  PaymentTypes,
  PaymentFrequencyTypes,
} from "@server/types/dbEnums.js";

export const paymentTypesEnum = pgEnum(
  "paument_type",
  Object.values(PaymentTypes) as [string, ...string[]],
);

// 1: transaction happens every * days
// 2: transaction happens on * day of every month
export const frequencyTypesEnum = pgEnum(
  "frequency_type",
  Object.values(PaymentFrequencyTypes) as [string, ...string[]],
);

// only successful transactions - if transaction didn't go through, it will not be saved
// transactions made with cash would also be saved here (user will enter manualy)
export const transactionsTable = pgTable(
  "transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    paymentType: paymentTypesEnum().default(PaymentTypes.Card),
    accountId: integer("account_id").references(() => accounts.id, {
      onDelete: "cascade",
    }),
    transactionId: varchar("transaction_id", { length: 255 }).unique(),
    transactionTime: timestamp("transaction_time"),
    description: varchar({ length: 255 }),
    //category
    amount: doublePrecision().notNull(), // commision will be included (if it exists)
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
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull().unique(),
    amount: doublePrecision().notNull(),
    currencyCode: isoCurrencyColumn(),
    nextDueDate: date("next_due_date"),
    fruequencyType: frequencyTypesEnum().default(
      PaymentFrequencyTypes.NumberOfDays,
    ),
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
      .references(() => users.id, { onDelete: "cascade" }),
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

export const wishlistsTable = pgTable(
  "wishlists",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
      .references(() => users.id, { onDelete: "cascade" }),
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

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  name: varchar({ length: 255 }).notNull().unique(),
  color: varchar({ length: 7 }),
  icon: varchar({ length: 255 }),
  isComposite: boolean("is_composite").default(false).notNull(),
  mccCodes: integer("mcc_codes")
    .array()
    .default(sql`ARRAY[]::integer[]`),
  includedCategories: integer("included_categories")
    .array()
    .default(sql`ARRAY[]::integer[]`),
});

// will create user_preferences table when start working on UI
// will think where to add common bought by user items
