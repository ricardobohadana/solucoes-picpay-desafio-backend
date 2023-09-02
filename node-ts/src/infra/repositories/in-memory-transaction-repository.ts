import { TransactionRepository } from "@/application/repository/transaction-repository";
import { Transaction } from "@/domain/aggregates/transaction";

export class InMemoryTransactionRepository implements TransactionRepository {
  transactions: Transaction[] = [];

  async save(transaction: Transaction) {
    this.transactions.push(transaction);
  }

  async update(transaction: Transaction) {
    const index = this.transactions.findIndex((tr) => tr.id === transaction.id);
    if (index === -1) {
      throw new Error("Conta inexistente");
    }
    this.transactions[index] = transaction;
  }
}
