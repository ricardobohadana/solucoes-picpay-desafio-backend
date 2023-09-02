import { User } from "@/domain/entities/user";
import { UserType } from "@/domain/enums/user-type";
import { randomUUID } from "crypto";
import { describe, expect, it, test } from "vitest";

test("Should create a new user", () => {
  const props = {
    cpfOrCnpj: "138.666.777-21",
    email: "email@email.com",
    fullName: "this is my full name",
    password: "fake password",
    userType: UserType.ECOMMERCE,
  };
  const user = User.create(props);

  expect(user.id).toBeDefined();
  expect(user.cpfOrCnpj).toEqual(props.cpfOrCnpj);
  expect(user.email).toEqual(props.email);
  expect(user.fullName).toEqual(user.fullName);
});

test("Should instantiate a user", () => {
  const props = {
    id: randomUUID(),
    cpfOrCnpj: "138.666.777-21",
    email: "email@email.com",
    fullName: "this is my full name",
    password: "fake password",
    userType: UserType.ECOMMERCE,
  };
  const user = User.instance(props);

  expect(user.id).toEqual(props.id);
  expect(user.cpfOrCnpj).toEqual(props.cpfOrCnpj);
  expect(user.email).toEqual(props.email);
  expect(user.fullName).toEqual(user.fullName);
});
