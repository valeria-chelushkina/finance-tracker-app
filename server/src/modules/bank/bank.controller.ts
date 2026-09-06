import { BankService } from "@server/modules/bank/bank.service.js";
import { Request, Response } from "express";

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
}
