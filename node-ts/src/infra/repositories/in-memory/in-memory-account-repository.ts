import { AccountRepository } from "@/application/repository/account-repository";
import { Account } from "@/domain/aggregates/account";

export class InMemoryAccountRepository implements AccountRepository {
  accounts: Account[] = [];

  async create(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async getAccountByNumber(accountNumber: number): Promise<Account> {
    const account = this.accounts.find(
      (account) => account.accountNumber === accountNumber,
    );
    if (!account) {
      throw new Error("Conta inexistente");
    }
    return account;
  }

  async update(account: Account): Promise<void> {
    const index = this.accounts.findIndex((accountItem) => accountItem.id === account.id);
    if (index === -1) {
      throw new Error("Conta inexistente");
    }
    this.accounts[index] = account;
  }

  async getAccountByUserId(userId: string): Promise<Account> {
    const account = this.accounts.find((account) => account.user.id === userId);
    if (!account) {
      throw new Error("Conta inexistente");
    }
    return account;
  }
}
