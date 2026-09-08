import {
  Transaction,
  CreateTransactionBody,
  CreateTransaction,
} from "@server/types/modules/transactionTypes.js";
import { TransactionRepository } from "@server/modules/transaction/transaction.repository.js";
import { TransactionService } from "@server/modules/transaction/transaction.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";

export class TransactionController extends BaseController<
  Transaction,
  CreateTransaction,
  CreateTransactionBody,
  TransactionRepository,
  TransactionService
> {
  constructor(service = new TransactionService()) {
    super(service.repository, service, "transaction");
  }

  createTransaction = this.create;
  getTransactionsByUserId = this.getByUserId;
  updateTransaction = this.update;
  deleteTransaction = this.delete;
}
