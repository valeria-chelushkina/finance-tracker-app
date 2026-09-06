import { AccountService } from "@server/modules/account/account.service.js";
import { JarService } from "@server/modules/jar/jar.service.js";
import { UserService } from "@server/modules/user/user.service.js";
import { MonobankClient } from "@server/integrations/monobank/monobank.client.js";
import {
  MonobankClientInfo,
  MonobankAccount,
  MonobankJar,
} from "@server/integrations/monobank/monobank.types.js";
import { BankProviders } from "@server/types/dbEnums.js";
import type { Account } from "@server/modules/account/account.module.js";
import {
  encryptToken,
  decryptToken,
} from "@server/utils/encryptDecryptToken.js";
import { AuthError } from "@server/errors/AppErrors.js";
import type {
  MonobankStatementParameters,
  MonobankTransaction,
} from "@server/integrations/monobank/monobank.types.js";

export class BankService {
  private readonly accountService = new AccountService();
  private readonly jarService = new JarService();
  private readonly userService = new UserService();
  private readonly monobankClient = new MonobankClient();

  async connectMonobank(userToken: string, userId: number) {
    const clientInfo: MonobankClientInfo =
      await this.monobankClient.getClientInfo(userToken);

    const encryptedUserToken = encryptToken(userToken);

    await this.userService.updateUser(userId, {
      bankToken: encryptedUserToken,
      name: clientInfo.name,
    });

    const userAccounts: MonobankAccount[] = clientInfo.accounts;

    if (userAccounts.length > 0) {
      for (const account of userAccounts) {
        const accountWithId: Omit<Account, "id"> = {
          userId: userId,
          bankName: BankProviders.Monobank,
          cardId: account.id,
          ...account,
        };
        await this.accountService.createAccount(accountWithId);
      }
    }

    const userJars: MonobankJar[] = clientInfo.jars;
    if (userJars.length > 0) {
      for (const jar of userJars) {
        const jarWithId = {
          userId: userId,
          jarId: jar.id,
          ...jar,
        };
        await this.jarService.createJar(jarWithId);
      }
    }

    return clientInfo;
  }

  async getStatement(userId: number, params: MonobankStatementParameters) {
    const encryptedUserToken: string | null = (
      await this.userService.findUserById(userId)
    ).bankToken;
    if (!encryptedUserToken) {
      throw new AuthError("User doesn't have a bank token. Cannot access.");
    }
    const userToken: string = decryptToken(encryptedUserToken);
    const transactions: MonobankTransaction[] =
      await this.monobankClient.getStatement(userToken, params);

    if (transactions.length > 0) {
      for (const transaction of transactions) {
        const transactionWithId = {
          userId: userId,
          ...transaction,
        };
      }
    }
  }
}
