import { transactions } from "@server/modules/transaction/transaction.module.js";

export type Transaction = typeof transactions.$inferSelect;

//export type TransactionWithoutId = typeof transactions.$inferInsert;

export type UpdateTransaction = Partial<
  Omit<typeof transactions.$inferInsert, "userId">
>;
