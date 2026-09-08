import { TransactionRepository } from "@server/modules/transaction/transaction.repository.js";
import type { Transaction, CreateTransaction } from "@server/types/modules/transactionTypes.js";
import { ConflictError, AppError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";
import { BaseService } from "@server/modules/base/base.service.js";

export class TransactionService extends BaseService<Transaction, CreateTransaction, TransactionRepository> {
  private readonly transactionRepository = new TransactionRepository();

  constructor(){
    super(new TransactionRepository(), 'transaction');
  }

  async createTransaction(payload: CreateTransaction): Promise<Transaction> {
    return this.create(payload);
  }
}
