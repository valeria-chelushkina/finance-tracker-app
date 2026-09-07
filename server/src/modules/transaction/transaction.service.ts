import { TransactionRepository } from "@server/modules/transaction/transaction.repository.js";
import type { Transaction } from "@server/types/modules/transactionTypes.js";
import { ConflictError, AppError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";

export class TransactionService {
  private readonly transactionRepository = new TransactionRepository();

  async createTransaction(payload: Transaction): Promise<Transaction> {
    const transaction = await this.transactionRepository.findTransactionById(
      payload.id,
    );

    if (transaction) {
      throw new ConflictError(ErrorMessages.alreadyExists("Transaction", "ID"));
    }

    const newTransaction =
      await this.transactionRepository.createTransaction(payload);

    if (!newTransaction) {
      throw new AppError(
        ErrorMessages.createFailed('transaction'),
        500,
      );
    }

    return newTransaction;
  }
}
