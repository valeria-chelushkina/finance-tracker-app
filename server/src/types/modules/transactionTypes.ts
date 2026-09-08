import { transactions } from "@server/modules/transaction/transaction.module.js";

export type Transaction = typeof transactions.$inferSelect;

export type CreateTransaction = typeof transactions.$inferInsert;

export type CreateTransactionBody = Omit<CreateTransaction, "userId" | "id">;

export type UpdateTransaction = Partial<
  Omit<typeof transactions.$inferInsert, "userId"  | "id">
>;

