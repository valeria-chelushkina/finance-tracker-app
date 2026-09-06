import { BankService } from "@server/modules/bank/bank.service.js";
import { Request, Response } from "express";
import type { MonobankStatementParameters } from "@server/integrations/monobank/monobank.types.js";

export class BankController {
  private readonly bankService = new BankService();

  connectMonobank = async (
    req: Request<unknown, unknown, { userToken: string }>,
    res: Response,
  ) => {
    const { userToken } = req.body;
    const userId: number = req.user!.userId;

    const clientInfo = await this.bankService.connectMonobank(
      userToken,
      userId,
    );

    res.status(200).json({
      message: "Token and client information was added successfully.",
      clientInfo,
    });
  };

  getStatement = async (
    req: Request<unknown, unknown, MonobankStatementParameters>,
    res: Response,
  ) => {
    const params: MonobankStatementParameters = req.body;

    const userId: number = req.user!.userId;

    const statement = await this.bankService.getStatement(userId, params);

    res.status(200).json({
      message: "Got statement successfully.",
      statement,
    });
  };
}
