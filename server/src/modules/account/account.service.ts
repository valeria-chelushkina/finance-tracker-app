import { AccountRepository } from "@server/modules/account/account.repository.js";
import type {
  Account,
  CreateAccount,
} from "@server/types/modules/accountTypes.js";
import {
  NotFoundError,
} from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";
import { BaseService } from "@server/modules/base/base.service.js";

export class AccountService extends BaseService<
  Account,
  CreateAccount,
  AccountRepository
> {
  constructor() {
    super(new AccountRepository(), "account");
  }

  async createAccount(payload: CreateAccount): Promise<Account> {
    return this.create(payload);
  }

  // added method here cause it gets used and error check duplicates two times
  async getAccountById(id: string | number): Promise<Account> {
    const account = await this.repository.findAccountById(id);
    console.debug(account);

    if (!account) {
      throw new NotFoundError(
        ErrorMessages.notFoundByField("account", "card ID", id),
      );
    }
    return account;
  }
}
