import { TransactionRepository } from "@server/modules/transaction/transaction.repository.js";
import type {
  Transaction,
  CreateTransaction,
} from "@server/types/modules/transactionTypes.js";
import { BaseService } from "@server/modules/base/base.service.js";
import { Entities } from "@server/types/entitiesEnum.js";

export class TransactionService extends BaseService<
  Transaction,
  CreateTransaction,
  TransactionRepository
> {
  constructor() {
    super(new TransactionRepository(), Entities.Transaction);
  }

  async createTransaction(payload: CreateTransaction): Promise<Transaction> {
    return this.create(payload);
  }
}
