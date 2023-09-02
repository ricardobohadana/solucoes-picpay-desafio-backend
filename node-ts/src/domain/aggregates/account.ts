import { Entity } from "../entities/base";
import { User } from "../entities/user";
import { UserType } from "../enums/user-type";

interface AccountProps {
  accountNumber: number;
  user: User;
  balance: number;
}

export class Account extends Entity<AccountProps> {
  static create(props: AccountProps) {
    return new Account({ props });
  }

  static instance({ id, ...props }: AccountProps & { id: string }) {
    return new Account({ id, props });
  }

  get accountNumber() {
    return this.props.accountNumber;
  }

  get user() {
    return this.props.user;
  }

  get balance() {
    return this.props.balance;
  }

  debit(amount: number) {
    if (this.props.balance < amount) throw new Error("Saldo insuficiente!");
    this.props.balance -= amount;
  }

  credit(amount: number) {
    this.props.balance += amount;
  }
}
