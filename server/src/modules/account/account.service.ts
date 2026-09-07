import { AccountRepository } from "@server/modules/account/account.repository.js";
import type { Account } from "@server/types/modules/accountTypes.js";
import { ConflictError, AppError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";

export class AccountService {
  private readonly accountRepository = new AccountRepository();

  async createAccount(payload: Account): Promise<Account> {
    const account = await this.accountRepository.findAccountById(payload.id);
    if (account) {
      throw new ConflictError(ErrorMessages.alreadyExists("Account", "ID"));
    }
    const newAccount = await this.accountRepository.createAccount(payload);
    if (!newAccount) {
      throw new AppError(ErrorMessages.createFailed("account"), 500);
    }
    return newAccount;
  }
}
