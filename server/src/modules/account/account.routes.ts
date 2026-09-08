import { Router } from "express";
import { AccountController } from "@server/modules/account/account.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const accountRouter = Router();
const accountController = new AccountController();

accountRouter.post("/", authMiddleware, accountController.createAccount);
accountRouter.get("/", authMiddleware, accountController.getAccountsByUserId);
accountRouter.patch("/", authMiddleware, accountController.updateAccount);
accountRouter.delete("/", authMiddleware, accountController.deleteAccount);
