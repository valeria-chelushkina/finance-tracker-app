import { AccountService } from "@server/modules/account/account.service.js";
import { JarService } from "@server/modules/jar/jar.service.js";
import { UserService } from "@server/modules/user/user.service.js";
import { CategoryService } from "@server/modules/category/category.service.js";
import { TransactionService } from "@server/modules/transaction/transaction.service.js";
import { MonobankClient } from "@server/integrations/monobank/monobank.client.js";
import { BankProviders, PaymentTypes } from "@server/types/dbEnums.js";
import type {
  Account,
  CreateAccount,
} from "@server/types/modules/accountTypes.js";
import { encryptToken, decryptToken } from "@server/utils/encryptUtils.js";
import { AuthError, ConflictError } from "@server/errors/AppErrors.js";
import type {
  MonobankStatementParameters,
  MonobankTransaction,
  MonobankClientInfo,
  MonobankAccount,
  MonobankJar,
} from "@server/types/monobankTypes.js";
import type { Jar, CreateJar } from "@server/types/modules/jarTypes.js";
import type {
  Transaction,
  CreateTransaction,
} from "@server/types/modules/transactionTypes.js";
import { validateStatementTimeRange } from "@server/helpers/monobankValidationHelpers.js";

type TransactionFetchedInfo = {
  category: number;
  accountId: string;
};

export class BankService {
  private readonly accountService = new AccountService();
  private readonly jarService = new JarService();
  private readonly userService = new UserService();
  private readonly categoryService = new CategoryService();
  private readonly monobankClient = new MonobankClient();
  private readonly transactionService = new TransactionService();

  async getMonobankInfo(
    userToken: string,
    userId: number,
  ): Promise<MonobankClientInfo> {
    const clientInfo = await this.monobankClient.getClientInfo(userToken);

    await this.syncUserInfo(userId, userToken, clientInfo);

    const userAccounts = clientInfo.accounts;

    await this.createEntriesTemplate<MonobankAccount, CreateAccount, Account>(
      userId,
      userAccounts,
      this.mapToAccount,
      (entry) => this.accountService.createAccount(entry),
    );

    const userJars = clientInfo.jars;

    await this.createEntriesTemplate<MonobankJar, CreateJar, Jar>(
      userId,
      userJars,
      this.mapToJar,
      (entry) => this.jarService.createJar(entry),
    );

    return clientInfo;
  }

  async getMonobankStatementInfo(
    userId: number,
    params: MonobankStatementParameters,
  ): Promise<MonobankTransaction[]> {
    this.validateStatementParameters(params, userId);

    const userToken = await this.decryptUserToken(userId);

    const transactions = await this.monobankClient.getClientStatement(
      userToken,
      params,
    );

    await this.createEntriesTemplate<
      MonobankTransaction,
      CreateTransaction,
      Transaction
    >(
      userId,
      transactions,
      this.mapToTransaction,
      (entry) => this.transactionService.createTransaction(entry),
      params.account,
    );

    return transactions;
  }

  private async syncUserInfo(
    userId: number,
    userToken: string,
    clientInfo: MonobankClientInfo,
  ): Promise<void> {
    const encryptedUserToken = encryptToken(userToken);

    const userNewInfo = {
      bankToken: encryptedUserToken,
      name: clientInfo.name,
    };

    await this.userService.updateUser(userId, userNewInfo);
  }

  private async decryptUserToken(userId: number): Promise<string> {
    const user = await this.userService.getUserById(userId);

    const encryptedUserToken = user.bankToken;

    if (!encryptedUserToken) {
      throw new AuthError("User doesn't have a bank token. Cannot access.");
    }
    return decryptToken(encryptedUserToken);
  }

  private async createEntriesTemplate<T, TCreate, TReturn = TCreate>(
    userId: number,
    entries: T[],
    fillCallback: (
      userId: number,
      entry: T,
      account?: string,
    ) => Promise<TCreate> | TCreate,
    createCallback: (fullEntry: TCreate) => Promise<TReturn>,
    account?: string,
  ) {
    if (entries.length > 0) {
      for (const entry of entries) {
        const fullEntry = await fillCallback(userId, entry, account);

        try {
          await createCallback(fullEntry);
        } catch (err: unknown) {
          if (err instanceof ConflictError) continue;
          else throw err;
        }
      }
    }
  }

  // === mapping functions ===

  private mapToAccount = (
    userId: number,
    account: MonobankAccount,
  ): Account => {
    return {
      ...account,
      userId: userId,
      bankName: BankProviders.Monobank,
      balance: account.balance / 100,
    };
  };

  private mapToJar = (userId: number, jar: MonobankJar): Jar => {
    return {
      ...jar,
      userId: userId,
      balance: jar.balance / 100,
      goal: jar.goal / 100,
    };
  };

  private mapToTransaction = async (
    userId: number,
    transaction: MonobankTransaction,
    account?: string,
  ): Promise<Transaction> => {
    const targetAccount = account ?? "0";
    const transactionFetchedInfo = await this.fetchInfoForTransaction(
      transaction,
      targetAccount,
    );
    const transactionTime = new Date(transaction.time * 1000);

    return {
      ...transaction,
      ...transactionFetchedInfo,
      userId: userId,
      paymentType: PaymentTypes.Card,
      transactionTime: transactionTime,
      balance: transaction.balance / 100,
      amount: transaction.amount / 100,
      operationAmount: transaction.operationAmount / 100,
      commissionRate: transaction.commissionRate / 100,
      cashbackAmount: transaction.cashbackAmount / 100,
    };
  };

  private async fetchInfoForTransaction(
    transaction: MonobankTransaction,
    account: string,
  ): Promise<TransactionFetchedInfo> {
    const transactionByMcc = await this.categoryService.getCategoryByMcc(
      transaction.mcc,
      transaction.originalMcc,
    );

    const transactionCategoryId = transactionByMcc.id;

    const userAccount = await this.accountService.getAccountById(account);

    const userAccountId = userAccount.id;

    return {
      category: transactionCategoryId,
      accountId: userAccountId,
    };
  }

  // === validate helpers ===

  private async validateAccountOwnership(
    id: string | number,
    userId: number,
  ): Promise<string> {
    const account = await this.accountService.getAccountById(id);

    if (account.userId !== userId) {
      throw new AuthError("No access to this information.");
    }

    return account.id;
  }

  private async validateStatementParameters(
    params: MonobankStatementParameters,
    currentUserId: number,
  ): Promise<void> {
    validateStatementTimeRange(params.from, params.to);
    this.validateAccountOwnership(params.account, currentUserId);
  }
}
