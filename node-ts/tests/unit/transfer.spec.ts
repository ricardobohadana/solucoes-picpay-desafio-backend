import { CreateUserUseCase } from "@/application/use-cases/create-user";
import { TransferUseCase } from "@/application/use-cases/transfer";
import { UserType } from "@/domain/enums/user-type";
import { NotificationGateway } from "@/application/interfaces/gateway/notification-gateway";
import { InMemoryAccountRepository } from "@/infra/repositories/in-memory/in-memory-account-repository";
import { InMemoryTransactionRepository } from "@/infra/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { TransferAuthorizationGateway } from "@/application/interfaces/gateway/transfer-auth-gateway";

describe("Transfer use case", () => {
  let accountRepository: InMemoryAccountRepository;
  let transactionRepository: InMemoryTransactionRepository;
  let userRepository: InMemoryUserRepository;
  let createUserUseCase: CreateUserUseCase;
  let notificationGateway: NotificationGateway;
  let transferAuthorizationGateway: TransferAuthorizationGateway;
  let sut: TransferUseCase;

  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository();
    transactionRepository = new InMemoryTransactionRepository();
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository, accountRepository);
    transferAuthorizationGateway = {
      authorize: async () => true,
    };
    notificationGateway = {
      notify: async (message: string) => {
        console.log(message);
      },
    };
    sut = new TransferUseCase(
      accountRepository,
      transactionRepository,
      notificationGateway,
      transferAuthorizationGateway,
    );

    const input = {
      cpfOrCnpj: "000.000.000-00",
      email: "email@email.com",
      fullName: "John Doe",
      userType: UserType.DEFAULT,
      password: "123456",
    };
    await createUserUseCase.execute(input);
    const input2 = {
      cpfOrCnpj: "100.000.000-00",
      email: "email2@email.com",
      fullName: "John Doe",
      userType: UserType.ECOMMERCE,
      password: "123456",
    };
    await createUserUseCase.execute(input2);
    accountRepository.accounts[0].credit(1000);
    accountRepository.accounts[1].credit(100);
  });

  it("Deve ser possível transferir dinheiro entre contas", async () => {
    const input = {
      accountFrom: accountRepository.accounts[0].accountNumber,
      accountTo: accountRepository.accounts[1].accountNumber,
      amount: 100,
    };

    await sut.execute(input);
    expect(accountRepository.accounts[0].balance).toBe(900);
    expect(accountRepository.accounts[1].balance).toBe(200);
    expect(transactionRepository.transactions.length).toBe(1);
  });

  it("Não deve ser possível transferir dinheiro de uma conta lojista", async () => {
    const input = {
      accountFrom: accountRepository.accounts[1].accountNumber,
      accountTo: accountRepository.accounts[0].accountNumber,
      amount: 100,
    };

    expect(async () => await sut.execute(input)).rejects.toThrow(
      "Conta de e-commerce não pode fazer transferências!",
    );
    expect(accountRepository.accounts[0].balance).toBe(1000);
    expect(accountRepository.accounts[1].balance).toBe(100);
    expect(transactionRepository.transactions.length).toBe(0);
  });
  it("Não deve ser possível transferir mais dinheiro do que seu saldo", async () => {
    const input = {
      accountFrom: accountRepository.accounts[0].accountNumber,
      accountTo: accountRepository.accounts[1].accountNumber,
      amount: 1001,
    };

    expect(async () => await sut.execute(input)).rejects.toThrow("Saldo insuficiente!");
    expect(accountRepository.accounts[0].balance).toBe(1000);
    expect(accountRepository.accounts[1].balance).toBe(100);
    expect(transactionRepository.transactions.length).toBe(0);
  });
});
