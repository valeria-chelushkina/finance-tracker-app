import {
  isoCurrencyColumn,
  isoCurrencyCheck,
} from "@server/helpers/dbHelpers.js";
import {
  integer,
  pgTable,
  varchar,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { users } from "@server/modules/user/user.module.js";

export const jars = pgTable(
  "jars",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sendId: varchar("send_id").notNull().unique(),
    title: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    currencyCode: isoCurrencyColumn(),
    balance: doublePrecision(),
    goal: doublePrecision(),
  },
  () => [isoCurrencyCheck("jars")],
);
