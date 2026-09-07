import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  boolean,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "@server/modules/user/user.module.js";

export const categories = pgTable(
  "categories",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    name: varchar({ length: 255 }).notNull(),
    color: varchar({ length: 7 }),
    icon: varchar({ length: 255 }),
    isComposite: boolean("is_composite").default(false).notNull(),
    mccCodes: integer("mcc_codes")
      .array()
      .default(sql`ARRAY[]::integer[]`),
    includedCategories: integer("included_categories")
      .array()
      .default(sql`ARRAY[]::integer[]`),
    shortDescriptionEn: varchar("short_description_en", { length: 255 }),
    shortDescriptionUa: varchar("short_description_ua", { length: 255 }),
    fullDescriptionEn: text("full_description_en"),
    fullDescriptionUa: text("full_description_ua"),
  },
  (t) => [unique("unique_user_category_name").on(t.userId, t.name)],
);
