import { User } from "@/domain/entities/user";

export interface UserRepository {
  getByCpforCnpjAndEmail(data: {
    cpfOrCnpj: string;
    email: string;
  }): Promise<User | null>;
  save(user: User): Promise<void>;
}
