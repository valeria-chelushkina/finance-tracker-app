import type { Transaction, UpdateTransaction } from "@server/modules/transaction/transaction.module.js";
import { transactions } from "@server/modules/transaction/transaction.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq } from "drizzle-orm";

export class TransactionRepository {
  private readonly dbClient: DbClient;

  constructor(dbClient: DbClient = db) {
    this.dbClient = dbClient;
  }

  async createTransaction(payload: Omit<Transaction, "id">): Promise<Transaction> {
    const [newTransaction] = await this.dbClient
      .insert(transactions)
      .values(payload)
      .returning();
    return newTransaction;
  }

  async findTransactionByTransactionId(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.dbClient
      .select()
      .from(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .limit(1);
    return transaction[0] || null;
  }

  async findTransactionById(id: number): Promise<Transaction | null> {
    const transaction = await this.dbClient
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);
    return transaction[0] || null;
  }

  async findTransactionsByUserId(id: number): Promise<Transaction[]> {
    const userTransactions = await this.dbClient
      .select()
      .from(transactions)
      .where(eq(transactions.userId, id));

    return userTransactions;
  }

  async updateTransaction(
    id: number,
    updatedFields: Partial<UpdateTransaction>,
  ): Promise<Transaction | null> {
    const [updatedTransaction] = await this.dbClient
      .update(transactions)
      .set(updatedFields)
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction || null;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const deletedTransaction = await this.dbClient
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning({ id: transactions.id });

    if (deletedTransaction.length > 0) {
      return true;
    }

    return false;
  }
}
