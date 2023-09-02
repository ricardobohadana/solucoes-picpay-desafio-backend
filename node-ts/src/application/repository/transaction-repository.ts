import { Transaction } from "@/domain/aggregates/transaction";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
}
