import { Router } from "express";
import { TransactionController } from "@server/modules/transaction/transaction.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const transactionRouter = Router();
const transactionController = new TransactionController();

transactionRouter.post("/", authMiddleware, transactionController.createTransaction);
transactionRouter.get("/", authMiddleware, transactionController.getTransactionsByUserId);

transactionRouter.patch("/", authMiddleware, transactionController.updateTransaction);
transactionRouter.delete("/", authMiddleware, transactionController.deleteTransaction);
