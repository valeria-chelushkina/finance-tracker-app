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
}
