import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "@modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same data of an existent user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      });

      await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
