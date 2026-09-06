import { AccountRepository } from "@server/modules/account/account.repository.js";
import type {
  Account,
  UpdateAccount,
} from "@server/modules/account/account.module.js";
import {
  ConflictError,
  AppError,
  NotFoundError,
  ValidationError,
} from "@server/errors/AppErrors.js";

export class AccountService {
  private readonly accountRepository = new AccountRepository();

  async createAccount(payload: Omit<Account, "id">): Promise<Account> {
    const account: Account | null = await this.accountRepository.findCardById(
      payload.cardId,
    );
    if (account) {
      throw new ConflictError("Account with such card id already exists.");
    }
    const newAccount: Account | null =
      await this.accountRepository.createAccount(payload);
    if (!newAccount) {
      throw new AppError("There was an error while creating new account.", 500);
    }
    return newAccount;
  }

  async findAccountById(id: number): Promise<Account> {
    const account: Account | null =
      await this.accountRepository.findAccountById(id);

    if (!account) {
      throw new NotFoundError("No account with such ID was found in database!");
    }

    return account;
  }

  async findCardById(cardId: string): Promise<Account> {
    const account: Account | null =
      await this.accountRepository.findCardById(cardId);

    if (!account) {
      throw new NotFoundError(
        "No account with such card ID was found in database!",
      );
    }

    return account;
  }

  async findAccountsByUserId(id: number): Promise<Account[]> {
    const accounts: Account[] =
      await this.accountRepository.findAccountsByUserId(id);

    if (accounts.length === 0) {
      throw new NotFoundError(
        "No accounts with such user ID was found in database!",
      );
    }

    return accounts;
  }

  async updateAccount(
    id: number,
    payload: Partial<UpdateAccount>,
  ): Promise<Account> {
    if (!payload) {
      throw new ValidationError("Payload is empty, nothing to update.");
    }
    const updatedAccount: Account | null =
      await this.accountRepository.updateAccount(id, payload);
    if (!updatedAccount) {
      throw new NotFoundError("No account with such ID was found in database!");
    }
    return updatedAccount;
  }

  async deleteAccount(id: number): Promise<boolean> {
    const deletedAccount: boolean =
      await this.accountRepository.deleteAccount(id);
    if (!deletedAccount) {
      throw new NotFoundError("No account with such ID was found in database!");
    }

    return deletedAccount;
  }
}
