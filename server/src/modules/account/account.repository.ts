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

  async findAccountById(id: string | number): Promise<Account | null> {
    return this.findById(id);
  }
}
