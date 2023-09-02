import { User } from "@/domain/entities/user";
import { UserRepository } from "../repository/user-repository";
import { UserType } from "@/domain/enums/user-type";
import { AccountRepository } from "../repository/account-repository";
import { Account } from "@/domain/aggregates/account";
import { randomInt } from "crypto";

interface Input {
  fullName: string;
  email: string;
  cpfOrCnpj: string;
  password: string;
  userType: UserType;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute({
    cpfOrCnpj,
    email,
    fullName,
    password,
    userType,
  }: Input): Promise<void> {
    const userExists = await this.userRepository.getByCpforCnpjAndEmail({
      cpfOrCnpj,
      email,
    });

    if (userExists) {
      throw new Error("Já existe um usuário cadastrado come esse Email ou CPF/CNPJ");
    }

    const user = User.create({
      cpfOrCnpj,
      email,
      fullName,
      password,
      userType,
    });

    await this.userRepository.save(user);

    const account = Account.create({
      accountNumber: randomInt(10000, 999999),
      balance: 0,
      user,
    });

    await this.accountRepository.create(account);
  }
}
