import { Transaction } from "@/domain/aggregates/transaction";
import { AccountRepository } from "../repository/account-repository";
import { TransactionRepository } from "../repository/transaction-repository";

interface Input {
  accountFrom: number;
  accountTo: number;
  amount: number;
}

type Output = void;

export class TransferUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute({ accountFrom, accountTo, amount }: Input): Promise<Output> {
    const accountToEntity = await this.accountRepository.getAccountByNumber(accountTo);
    const accountFromEntity = await this.accountRepository.getAccountByNumber(
      accountFrom,
    );

    const transaction = Transaction.create({
      fromAccount: accountFromEntity,
      toAccount: accountToEntity,
      amount,
    });
    transaction.execute();

    try {
      await this.transactionRepository.save(transaction);
      await this.accountRepository.update(accountFromEntity);
      await this.accountRepository.update(accountToEntity);
    } catch (error) {
      transaction.rollback();
      try {
        await this.transactionRepository.update(transaction);
      } finally {
        await this.accountRepository.update(accountFromEntity);
        await this.accountRepository.update(accountToEntity);
      }
    }
  }
}
