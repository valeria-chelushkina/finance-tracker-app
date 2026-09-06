import type {
  Account,
  UpdateAccount,
} from "@server/modules/account/account.module.js";
import { accounts } from "@server/modules/account/account.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq } from "drizzle-orm";

export class AccountRepository {
  private readonly dbClient: DbClient;

  constructor(dbClient: DbClient = db) {
    this.dbClient = dbClient;
  }

  async createAccount(payload: Omit<Account, "id">): Promise<Account> {
    const [newAccount] = await this.dbClient
      .insert(accounts)
      .values(payload)
      .returning();
    return newAccount;
  }

  async findCardById(cardId: string): Promise<Account | null> {
    const cardAccount = await this.dbClient
      .select()
      .from(accounts)
      .where(eq(accounts.cardId, cardId))
      .limit(1);
    return cardAccount[0] || null;
  }

  async findAccountById(id: number): Promise<Account | null> {
    const account = await this.dbClient
      .select()
      .from(accounts)
      .where(eq(accounts.id, id))
      .limit(1);
    return account[0] || null;
  }

  async findAccountsByUserId(id: number): Promise<Account[]> {
    const userAccounts = await this.dbClient
      .select()
      .from(accounts)
      .where(eq(accounts.userId, id));
    return userAccounts;
  }

  async updateAccount(
    id: number,
    updatedFields: Partial<UpdateAccount>,
  ): Promise<Account | null> {
    const [updatedAccount] = await this.dbClient
      .update(accounts)
      .set(updatedFields)
      .where(eq(accounts.id, id))
      .returning();
    return updatedAccount || null;
  }

  async deleteAccount(id: number): Promise<boolean> {
    const deletedAccount = await this.dbClient
      .delete(accounts)
      .where(eq(accounts.id, id))
      .returning({ id: accounts.id });

    if (deletedAccount.length > 0) {
      return true;
    }

    return false;
  }
}
