import { TransactionRepository } from "@server/modules/transaction/transaction.repository.js";
import type {
  Transaction,
  UpdateTransaction,
} from "@server/modules/transaction/transaction.module.js";
import {
  ConflictError,
  AppError,
  NotFoundError,
  ValidationError,
} from "@server/errors/AppErrors.js";

export class TransactionService {
  private readonly transactionRepository = new TransactionRepository();

  // when user manually creates a transaction, it doesnt have a transaction id (like in monobank for example).
  // this function creates a unique transaction id for manual created ones.
  private generateManualTransactionId(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    return `TX-MANUAL-${timestamp}-${randomSuffix}`;
  }

  async createTransaction(
    payload: Omit<Transaction, "id">,
  ): Promise<Transaction> {
    const transactionId = payload.transactionId
      ? payload.transactionId
      : this.generateManualTransactionId();
    const transaction: Transaction | null =
      await this.transactionRepository.findTransactionByTransactionId(
        transactionId,
      );
    if (transaction) {
      throw new ConflictError(
        "Transaction with such transaction id already exists.",
      );
    }
    const newTransaction: Transaction | null =
      await this.transactionRepository.createTransaction(payload);
    if (!newTransaction) {
      throw new AppError(
        "There was an error while creating new transaction.",
        500,
      );
    }
    return newTransaction;
  }

  async findTransactionById(id: number): Promise<Transaction> {
    const transaction: Transaction | null =
      await this.transactionRepository.findTransactionById(id);

    if (!transaction) {
      throw new NotFoundError(
        "No transaction with such ID was found in database!",
      );
    }

    return transaction;
  }

  async findTransactionByTransactionId(
    transactionId: string,
  ): Promise<Transaction> {
    const transaction: Transaction | null =
      await this.transactionRepository.findTransactionByTransactionId(
        transactionId,
      );

    if (!transaction) {
      throw new NotFoundError(
        "No transaction with such transaction ID was found in database!",
      );
    }

    return transaction;
  }

  async findTransactionsByUserId(id: number): Promise<Transaction[]> {
    const transactions: Transaction[] =
      await this.transactionRepository.findTransactionsByUserId(id);

    if (!transactions) {
      throw new NotFoundError(
        "No transaction with such user ID was found in database!",
      );
    }

    return transactions;
  }

  async updateTransaction(
    id: number,
    payload: Partial<UpdateTransaction>,
  ): Promise<Transaction> {
    if (!payload) {
      throw new ValidationError("Payload is empty, nothing to update.");
    }
    const updatedTransaction: Transaction | null =
      await this.transactionRepository.updateTransaction(id, payload);
    if (!updatedTransaction) {
      throw new NotFoundError(
        "No transaction with such ID was found in database!",
      );
    }
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const deletedTransaction: boolean =
      await this.transactionRepository.deleteTransaction(id);
    if (!deletedTransaction) {
      throw new NotFoundError(
        "No transaction with such ID was found in database!",
      );
    }

    return deletedTransaction;
  }
}
