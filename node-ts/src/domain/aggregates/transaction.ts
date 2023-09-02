import { Account } from "./account";
import { Entity } from "../entities/base";
import { UserType } from "../enums/user-type";

interface TransactionProps {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  timestamp: Date;
  executedOn?: Date;
  rollbackedOn?: Date;
}

export class Transaction extends Entity<TransactionProps> {
  static create(props: Omit<TransactionProps, "timestamp">) {
    return new Transaction({
      props: {
        ...props,
        timestamp: new Date(),
      },
    });
  }

  static instance({ id, ...props }: TransactionProps & { id: string }) {
    return new Transaction({ props, id });
  }

  get fromAccountId() {
    return this.props.fromAccount;
  }

  get toAccountId() {
    return this.props.toAccount;
  }

  get amount() {
    return this.props.amount;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  execute() {
    if (this.props.fromAccount.user.userType === UserType.ECOMMERCE)
      throw new Error("Conta de e-commerce não pode fazer transferências!");
    this.props.fromAccount.debit(this.props.amount);
    this.props.toAccount.credit(this.props.amount);
    this.props.executedOn = new Date();
  }

  rollback() {
    this.props.fromAccount.credit(this.props.amount);
    this.props.toAccount.debit(this.props.amount);
    this.props.rollbackedOn = new Date();
  }
}
