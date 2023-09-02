import { UserType } from "../enums/user-type";
import { Entity } from "./base";

interface UserProps {
  fullName: string;
  cpfOrCnpj: string;
  email: string;
  password: string;
  userType: UserType;
}

export class User extends Entity<UserProps> {
  static instance({ id, ...props }: UserProps & { id: string }) {
    return new User({ props, id });
  }

  static create(props: UserProps) {
    return new User({ props });
  }

  get fullName() {
    return this.props.fullName;
  }

  get cpfOrCnpj() {
    return this.props.cpfOrCnpj;
  }

  get email() {
    return this.props.email;
  }

  get userType() {
    return this.props.userType;
  }
}
