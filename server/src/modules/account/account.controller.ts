import { Request, Response } from "express";
import {
  Account,
  CreateAccountBody,
  CreateAccount,
} from "@server/types/modules/accountTypes.js";
import { AccountRepository } from "@server/modules/account/account.repository.js";
import { AccountService } from "@server/modules/account/account.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";
import type {
  BodyParameters,
  UpdateBodyParameters,
} from "@server/types/controllerTypes.js";

export class AccountController extends BaseController<
  Account,
  CreateAccount,
  CreateAccountBody,
  AccountRepository,
  AccountService
> {
  constructor() {
    super(new AccountRepository(), new AccountService(), "account");
  }

  createAccount = async (
    req: Request<unknown, unknown, CreateAccountBody>,
    res: Response,
  ) => {
    this.create(req, res);
  };

  getAccountsByUserId = async (req: Request, res: Response) => {
    return this.getByUserId(req, res);
  };

  updateAccount = async (
    req: Request<unknown, unknown, UpdateBodyParameters<Account>>,
    res: Response,
  ) => {
    return this.update(req, res);
  };

  deleteAccount = async (
    req: Request<unknown, unknown, BodyParameters>,
    res: Response,
  ) => {
    return this.delete(req, res);
  };
}
