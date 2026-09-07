import type {
  Account,
  CreateAccount,
  UpdateAccount,
} from "@server/types/modules/accountTypes.js";
import { accounts } from "@server/modules/account/account.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq } from "drizzle-orm";
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

  async findAccountsByUserId(id: number): Promise<Account[]> {
    return this.findByUserId(id);
  }

  async updateAccount(
    id: number,
    updatedFields: UpdateAccount,
  ): Promise<Account | null> {
    return this.update(id, updatedFields);
  }

  async deleteAccount(id: number): Promise<boolean> {
    return this.delete(id);
  }

  async findCardById(cardId: string): Promise<Account | null> {
    const cardAccount = await this.dbClient
      .select()
      .from(accounts)
      .where(eq(accounts.cardId, cardId))
      .limit(1);
    return cardAccount[0] || null;
  }
}
