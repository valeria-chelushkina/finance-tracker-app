import {
  Account,
  CreateAccountBody,
  CreateAccount,
} from "@server/types/modules/accountTypes.js";
import { AccountRepository } from "@server/modules/account/account.repository.js";
import { AccountService } from "@server/modules/account/account.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";

export class AccountController extends BaseController<
  Account,
  CreateAccount,
  CreateAccountBody,
  AccountRepository,
  AccountService
> {
  constructor(service = new AccountService()) {
    super(service.repository, service, "account");
  }

  createAccount = this.create;
  getAccountsByUserId = this.getByUserId;
  updateAccount = this.update;
  deleteAccount = this.delete;
}
