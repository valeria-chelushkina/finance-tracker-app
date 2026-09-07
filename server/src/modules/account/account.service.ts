import { AccountRepository } from "@server/modules/account/account.repository.js";
import type {
  Account, CreateAccount
} from "@server/types/modules/accountTypes.js";
import {
  ConflictError,
  AppError,
} from "@server/errors/AppErrors.js";

export class AccountService {
  private readonly accountRepository = new AccountRepository();

  async createAccount(payload: CreateAccount): Promise<Account> {
    const account = await this.accountRepository.findCardById(
      payload.cardId,
    );
    if (account) {
      throw new ConflictError("Account with such card id already exists.");
    }
    const newAccount =
      await this.accountRepository.createAccount(payload);
    if (!newAccount) {
      throw new AppError("There was an error while creating new account.", 500);
    }
    return newAccount;
  }
}
