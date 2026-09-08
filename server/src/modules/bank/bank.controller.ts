import { BankService } from "@server/modules/bank/bank.service.js";
import { Request, Response } from "express";
import type {
  MonobankStatementParameters,
  MonobankClientInfo,
  MonobankTransaction,
} from "@server/types/monobankTypes.js";

type ConnectMonobankBodyParameters = {
  userToken: string;
};

export class BankController {
  private readonly bankService = new BankService();

  connectMonobank = async (
    req: Request<unknown, unknown, ConnectMonobankBodyParameters>,
    res: Response,
  ) => {
    const { userToken } = req.body;
    const userId: number = req.user.userId;

    const clientInfo: MonobankClientInfo =
      await this.bankService.getMonobankInfo(userToken, userId);

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

    const userId: number = req.user.userId;

    const statement: MonobankTransaction[] =
      await this.bankService.getMonobankStatementInfo(userId, params);

    res.status(200).json({
      message: "Got statement successfully.",
      statement,
    });
  };
}
