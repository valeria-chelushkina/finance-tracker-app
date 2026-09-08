import type {
  Account,
  CreateAccount,
  UpdateAccount,
} from "@server/types/modules/accountTypes.js";
import { accounts } from "@server/modules/account/account.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class AccountRepository extends BaseRepository<
  typeof accounts,
  Account,
  CreateAccount,
  UpdateAccount
> {
  constructor(dbClient: DbClient = db) {
    super(accounts, dbClient);
  }

  async createAccount(payload: CreateAccount): Promise<Account> {
    return this.create(payload);
  }

  async findAccountById(id: number): Promise<Account | null> {
    return this.findById(id);
  }

  async findAccountByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Account | null> {
    return this.findByIdAndUserId(id, userId);
  }

  async findAccountsByUserId(id: number): Promise<Account[]> {
    return this.findByUserId(id);
  }

  async updateAccount(
    id: number,
    userId: number,
    updatedFields: UpdateAccount,
  ): Promise<Account | null> {
    return this.update(id, userId, updatedFields);
  }

  async deleteAccount(id: number, userId: number): Promise<boolean> {
    return this.delete(id, userId);
  }
}
