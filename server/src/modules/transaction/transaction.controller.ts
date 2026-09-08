import { Request, Response } from "express";
import {
  Transaction,
  CreateTransactionBody,
  CreateTransaction,
} from "@server/types/modules/transactionTypes.js";
import { TransactionRepository } from "@server/modules/transaction/transaction.repository.js";
import { TransactionService } from "@server/modules/transaction/transaction.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";
import type {
  BodyParameters,
  UpdateBodyParameters,
} from "@server/types/controllerTypes.js";

export class TransactionController extends BaseController<
  Transaction,
  CreateTransaction,
  CreateTransactionBody,
  TransactionRepository,
  TransactionService
> {
  constructor() {
    super(new TransactionRepository(), new TransactionService(), "transaction");
  }

  createTransaction = async (
    req: Request<unknown, unknown, CreateTransactionBody>,
    res: Response,
  ) => {
    return this.create(req, res);
  };

  getTransactionsByUserId = async (req: Request, res: Response) => {
    return this.getByUserId(req, res);
  };

  updateTransaction = async (
    req: Request<unknown, unknown, UpdateBodyParameters<Transaction>>,
    res: Response,
  ) => {
    return this.update(req, res);
  };

  deleteTransaction = async (
    req: Request<unknown, unknown, BodyParameters>,
    res: Response,
  ) => {
    return this.delete(req, res);
  };
}
