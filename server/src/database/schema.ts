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
  date,
  pgEnum,
  boolean,
  jsonb,
  text,
  check,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "@server/modules/user/user.module.js";
import { categories } from "@server/modules/category/category.module.js";
import { PaymentFrequencyTypes } from "@server/types/dbEnums.js";

// 1: transaction happens every * days
// 2: transaction happens on * day of every month
export const frequencyTypesEnum = pgEnum(
  "frequency_type",
  Object.values(PaymentFrequencyTypes) as [string, ...string[]],
);

export const recurringTransactionsTable = pgTable(
  "recurring_transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull().unique(),
    category: integer().references(() => categories.id, {
      onDelete: "cascade",
    }),
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
    category: integer().references(() => categories.id, {
      onDelete: "cascade",
    }),
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
    category: integer().references(() => categories.id, {
      onDelete: "cascade",
    }),
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

// will create user_preferences table when start working on UI
// will think where to add common bought by user items
