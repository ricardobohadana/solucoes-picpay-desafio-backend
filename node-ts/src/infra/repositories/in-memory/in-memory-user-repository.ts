import { UserRepository } from "@/application/repository/user-repository";
import { User } from "@/domain/entities/user";

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async getByCpforCnpjAndEmail(data: {
    cpfOrCnpj: string;
    email: string;
  }): Promise<User | null> {
    return (
      this.users.find(
        (user) => user.cpfOrCnpj === data.cpfOrCnpj || user.email === data.email,
      ) ?? null
    );
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
