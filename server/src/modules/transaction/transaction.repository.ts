import type { Transaction, UpdateTransaction } from "@server/modules/transaction/transaction.module.js";
import { transactions } from "@server/modules/transaction/transaction.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq } from "drizzle-orm";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class TransactionRepository extends BaseRepository<typeof transactions, Transaction, UpdateTransaction> {

  constructor(dbClient: DbClient = db) {
    super(transactions, dbClient)
  }

  async createTransaction(payload: Omit<Transaction, "id">): Promise<Transaction> {
    return this.create(payload);
  }

  async findTransactionById(id: number): Promise<Transaction | null> {
    return this.findById(id);
  }

  async findTransactionsByUserId(id: number): Promise<Transaction[]> {
    return this.findByUserId(id);
  }

  async updateTransaction(
    id: number,
    updatedFields: Partial<UpdateTransaction>,
  ): Promise<Transaction | null> {
    return this.update(id, updatedFields);
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.delete(id);
  }

    async findTransactionByTransactionId(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.dbClient
      .select()
      .from(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .limit(1);
    return transaction[0] || null;
  }
}
