import { Transaction } from "@/domain/aggregates/transaction";
import { AccountRepository } from "../repository/account-repository";
import { TransactionRepository } from "../repository/transaction-repository";
import { NotificationGateway } from "@/application/interfaces/gateway/notification-gateway";
import { TransferAuthorizationGateway } from "../interfaces/gateway/transfer-auth-gateway";

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
    private readonly notificationGateway: NotificationGateway,
    private readonly transferAuthorizationGateway: TransferAuthorizationGateway,
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

    const transferAuthorized = await this.transferAuthorizationGateway.authorize();
    if (!transferAuthorized) {
      throw new Error("Transferência não autorizada");
    }

    transaction.execute();
    await this.transactionRepository.save(transaction);
    await this.notificationGateway.notify(
      `Transferência de ${accountFrom} para ${accountTo} no valor de ${amount} realizada com sucesso às ${transaction.timestamp.toLocaleString()}`,
    );
  }
}
