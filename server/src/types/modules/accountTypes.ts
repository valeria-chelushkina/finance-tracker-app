import { accounts } from "@server/modules/account/account.module.js";

export type Account = typeof accounts.$inferSelect;

export type UpdateAccount = Partial<
  Omit<typeof accounts.$inferInsert, "userId">
>;
