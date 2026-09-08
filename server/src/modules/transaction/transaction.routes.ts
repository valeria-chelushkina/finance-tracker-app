import { Router } from "express";
import { TransactionController } from "@server/modules/transaction/transaction.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const transactionRouter = Router({ mergeParams: true });
const transactionController = new TransactionController();

transactionRouter.post("/", authMiddleware, transactionController.createTransaction);
transactionRouter.get("/", authMiddleware, transactionController.getTransactionsByUserId);
transactionRouter.patch("/:id", authMiddleware, transactionController.updateTransaction);
transactionRouter.delete("/:id", authMiddleware, transactionController.deleteTransaction);
