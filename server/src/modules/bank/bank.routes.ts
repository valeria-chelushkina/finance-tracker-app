import { Router } from "express";
import { BankController } from "@server/modules/bank/bank.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const bankRouter = Router();
const bankController = new BankController();

bankRouter.get("/connect", authMiddleware, bankController.connectMonobank);
