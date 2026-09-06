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

export class BankService {
  private readonly accountService = new AccountService();
  private readonly jarService = new JarService();
  private readonly userService = new UserService();
  private readonly monobankClient = new MonobankClient();

  async connectMonobank(userToken: string, userId: number) {

    const clientInfo: MonobankClientInfo =
      await this.monobankClient.getClientInfo(userToken);
      
    await this.userService.updateUser(userId, {
      bankToken: userToken,
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
}
