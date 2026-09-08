import type {
  Transaction,
  CreateTransaction,
  UpdateTransaction,
} from "@server/types/modules/transactionTypes.js";
import { transactions } from "@server/modules/transaction/transaction.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class TransactionRepository extends BaseRepository<
  typeof transactions,
  Transaction,
  CreateTransaction,
  UpdateTransaction
> {
  constructor(dbClient: DbClient = db) {
    super(transactions, dbClient);
  }

  async createTransaction(payload: CreateTransaction): Promise<Transaction> {
    return this.create(payload);
  }

  async findTransactionById(id: number): Promise<Transaction | null> {
    return this.findById(id);
  }

  async findTransactionByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Transaction | null> {
    return this.findByIdAndUserId(id, userId);
  }

  async findTransactionsByUserId(id: number): Promise<Transaction[]> {
    return this.findByUserId(id);
  }

  async updateTransaction(
    id: number,
    userId: number,
    updatedFields: Partial<UpdateTransaction>,
  ): Promise<Transaction | null> {
    return this.update(id, userId, updatedFields);
  }

  async deleteTransaction(id: number, userId: number): Promise<boolean> {
    return this.delete(id, userId);
  }
}
