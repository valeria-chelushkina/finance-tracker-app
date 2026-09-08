import { Router } from "express";
import { AccountController } from "@server/modules/account/account.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const accountRouter = Router({ mergeParams: true });
const accountController = new AccountController();

accountRouter.post("/", authMiddleware, accountController.createAccount);
accountRouter.get("/", authMiddleware, accountController.getAccountsByUserId);
accountRouter.patch("/:id", authMiddleware, accountController.updateAccount);
accountRouter.delete("/:id", authMiddleware, accountController.deleteAccount);
