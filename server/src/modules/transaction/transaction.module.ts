import {
  isoCurrencyColumn,
  isoCurrencyCheck,
} from "@server/helpers/dbHelpers.js";
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "@server/modules/user/user.module.js";
import { accounts } from "@server/modules/account/account.module.js";
import { categories } from "@server/modules/category/category.module.js";
import { PaymentTypes } from "@server/types/dbEnums.js";

export const paymentTypesEnum = pgEnum(
  "paument_type",
  Object.values(PaymentTypes) as [string, ...string[]],
);

// only successful transactions - if transaction didn't go through, it will not be saved
// transactions made with cash would also be saved here (user will enter manualy)
export const transactions = pgTable(
  "transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    paymentType: paymentTypesEnum().default(PaymentTypes.Card),
    balance: doublePrecision().notNull(),
    accountId: integer("account_id").references(() => accounts.id, {
      onDelete: "cascade",
    }),
    transactionId: varchar("transaction_id", { length: 255 }).unique(),
    transactionTime: timestamp("transaction_time"),
    description: varchar({ length: 255 }),
    category: integer().references(() => categories.id, {
      onDelete: "cascade",
    }),
    amount: doublePrecision().notNull(),
    operationAmount: doublePrecision("operation_amount"),
    currencyCode: isoCurrencyColumn(),
    commissionRate: doublePrecision("commission_rate"),
    cashbackAmount: doublePrecision("cashback_amount"),
    comment: varchar({ length: 255 }),
  },
  () => [isoCurrencyCheck("transactions")],
);

export type Transaction = typeof transactions.$inferSelect;
export type UpdateTransaction = Partial<Omit<typeof transactions.$inferInsert, "userId">>;
