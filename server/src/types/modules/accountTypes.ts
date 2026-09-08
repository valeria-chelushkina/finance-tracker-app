import { accounts } from "@server/modules/account/account.module.js";

export type Account = typeof accounts.$inferSelect;

export type CreateAccount = typeof accounts.$inferInsert;

export type CreateAccountBody = Omit<CreateAccount, "userId" | "id">;

export type UpdateAccount = Partial<
  Omit<typeof accounts.$inferInsert, "userId" | "id">
>;

