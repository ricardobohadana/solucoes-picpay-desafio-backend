import { Account } from "@/domain/aggregates/account";

export interface AccountRepository {
  create(account: Account): Promise<void>;
  getAccountByNumber(accountNumber: number): Promise<Account>;
  getAccountByUserId(userId: string): Promise<Account>;
  update(account: Account): Promise<void>;
}
