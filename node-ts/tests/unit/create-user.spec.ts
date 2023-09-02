import { CreateUserUseCase } from "@/application/use-cases/create-user";
import { UserType } from "@/domain/enums/user-type";
import { InMemoryAccountRepository } from "@/infra/repositories/in-memory-account-repository";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory-user-repository";
import { expect, describe, it, beforeEach } from "vitest";

describe("Create user use case", async () => {
  let userRepository: InMemoryUserRepository;
  let accountRepository: InMemoryAccountRepository;
  let sut: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    accountRepository = new InMemoryAccountRepository();
    sut = new CreateUserUseCase(userRepository, accountRepository);
  });
  it("Deve criar um usuário e sua conta", async () => {
    const input = {
      cpfOrCnpj: "000.000.000-00",
      email: "email@email.com",
      fullName: "John Doe",
      userType: UserType.DEFAULT,
      password: "123456",
    };

    await sut.execute(input);

    expect(userRepository.users).toHaveLength(1);
    expect(accountRepository.accounts).toHaveLength(1);
  });

  it("Não deve criar um usuário se o email já foi registrado", async () => {
    const input1 = {
      cpfOrCnpj: "000.000.000-00",
      email: "email@email.com",
      fullName: "John Doe",
      userType: UserType.DEFAULT,
      password: "123456",
    };
    await sut.execute(input1);

    const input = {
      cpfOrCnpj: "100.000.000-00",
      email: "email@email.com",
      fullName: "John Doe",
      userType: UserType.DEFAULT,
      password: "123456",
    };

    expect(async () => await sut.execute(input)).rejects.toThrow(
      "Já existe um usuário cadastrado come esse Email ou CPF/CNPJ",
    );
    expect(userRepository.users).toHaveLength(1);
    expect(accountRepository.accounts).toHaveLength(1);
  });

  it("Não deve criar um usuário se o CPF/CNPJ já foi registrado", async () => {
    const input1 = {
      cpfOrCnpj: "000.000.000-00",
      email: "email@email.com",
      fullName: "John Doe",
      userType: UserType.DEFAULT,
      password: "123456",
    };
    await sut.execute(input1);

    const input = {
      cpfOrCnpj: "000.000.000-00",
      email: "email2@email.com",
      fullName: "John Doe",
      userType: UserType.DEFAULT,
      password: "123456",
    };

    expect(async () => await sut.execute(input)).rejects.toThrow(
      "Já existe um usuário cadastrado come esse Email ou CPF/CNPJ",
    );
    expect(userRepository.users).toHaveLength(1);
    expect(accountRepository.accounts).toHaveLength(1);
  });
});
