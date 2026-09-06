import { AccountService } from "@server/modules/account/account.service.js";
import { JarService } from "@server/modules/jar/jar.service.js";
import { UserService } from "@server/modules/user/user.service.js";
import { CategoryService } from "@server/modules/category/category.service.js";
import { TransactionService } from "@server/modules/transaction/transaction.service.js";
import { MonobankClient } from "@server/integrations/monobank/monobank.client.js";
import { BankProviders, PaymentTypes } from "@server/types/dbEnums.js";
import type { Account } from "@server/modules/account/account.module.js";
import {
  encryptToken,
  decryptToken,
} from "@server/utils/encryptDecryptToken.js";
import {
  AuthError,
  ValidationError,
  ConflictError,
} from "@server/errors/AppErrors.js";
import type {
  MonobankStatementParameters,
  MonobankTransaction,
  MonobankClientInfo,
  MonobankAccount,
  MonobankJar,
} from "@server/types/monobankTypes.js";
import { Jar } from "@server/modules/jar/jar.module.js";
import { Transaction } from "@server/modules/transaction/transaction.module.js";

export class BankService {
  private readonly accountService = new AccountService();
  private readonly jarService = new JarService();
  private readonly userService = new UserService();
  private readonly categoryService = new CategoryService();
  private readonly monobankClient = new MonobankClient();
  private readonly transactionService = new TransactionService();

  private async validateStatementParameters(
    params: MonobankStatementParameters,
    currentUserId: number,
  ): Promise<void> {
    const timeNow: number = Date.now();

    const targetDate: Date = new Date();

    // 31 days + 1 hour from right now
    targetDate.setDate(targetDate.getDate() - 31);
    targetDate.setHours(targetDate.getHours() - 1);

    const lastTimestamp: number = Math.floor(targetDate.getTime() / 1000);

    // validation, considering api request limitations
    if (
      (params.to &&
        (Number(params.to) > timeNow ||
          Number(params.to) < Number(params.from))) ||
      Number(params.from) < lastTimestamp
    ) {
      throw new ValidationError("Invalid parameters input.");
    }

    const accountUserId: number = (
      await this.accountService.findCardById(params.account)
    ).userId;
    if (accountUserId !== currentUserId) {
      throw new AuthError("No access to this information.");
    }
  }

  async connectMonobank(
    userToken: string,
    userId: number,
  ): Promise<MonobankClientInfo> {
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
          ...account,
          userId: userId,
          bankName: BankProviders.Monobank,
          cardId: account.id,
          balance: account.balance / 100,
        };
        try {
          await this.accountService.createAccount(accountWithId);
        } catch (err: unknown) {
          if (err instanceof ConflictError)
            continue; // let program continue creating next accounts even if this one already exists else
          else throw err;
        }
      }
    }

    const userJars: MonobankJar[] = clientInfo.jars;
    if (userJars.length > 0) {
      for (const jar of userJars) {
        const jarWithId: Omit<Jar, "id"> = {
          ...jar,
          userId: userId,
          jarId: jar.id,
          balance: jar.balance / 100,
          goal: jar.goal / 100,
        };

        try {
          await this.jarService.createJar(jarWithId);
        } catch (err: unknown) {
          if (err instanceof ConflictError) continue;
          else throw err;
        }
      }
    }

    return clientInfo;
  }

  async getStatement(
    userId: number,
    params: MonobankStatementParameters,
  ): Promise<MonobankTransaction[]> {
    this.validateStatementParameters(params, userId);

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
        const transactionCategoryId: number = (
          await this.categoryService.findcategoryByMcc(
            transaction.mcc,
            transaction.originalMcc,
          )
        ).id;

        const accountId: number = (
          await this.accountService.findCardById(params.account)
        ).id;

        const transactionTime: Date = new Date(transaction.time * 1000);

        const fullTransaction: Omit<Transaction, "id"> = {
          ...transaction,
          userId: userId,
          category: transactionCategoryId,
          paymentType: PaymentTypes.Card,
          accountId: accountId,
          transactionId: transaction.id,
          transactionTime: transactionTime,
          balance: transaction.balance / 100,
          amount: transaction.amount / 100,
          operationAmount: transaction.operationAmount / 100,
          commissionRate: transaction.commissionRate / 100,
          cashbackAmount: transaction.cashbackAmount / 100,
        };
        try {
          await this.transactionService.createTransaction(fullTransaction);
        } catch (error: unknown) {
          if (error instanceof ConflictError) continue;
          else throw error;
        }
      }
    }

    return transactions;
  }
}
