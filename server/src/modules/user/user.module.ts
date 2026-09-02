import {
  pgTable,
  integer,
  varchar,
  text,
  doublePrecision,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar({ length: 255 }),
    profilePicture: text("profile_picture"), //??
    bankToken: varchar("bank_token", { length: 255 }).unique(),
    expectedSalary: doublePrecision("expected_salary"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [check("salary_check", sql`${t.expectedSalary} > 0`)],
);

export type User = typeof users.$inferSelect;

// UpdateUser - type is used only when user updates their information.
// can't change id, email or timestamps
export type UpdateUser = Partial<Omit<
  typeof users.$inferInsert,
  "email" | "createdAt" | "updatedAt"
>>;
