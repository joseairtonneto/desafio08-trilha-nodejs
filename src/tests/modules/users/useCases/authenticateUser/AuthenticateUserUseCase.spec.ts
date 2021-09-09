import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "@modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    };

    await createUserUseCase.execute(user);

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(auth).toHaveProperty("token");
    expect(auth).toHaveProperty("user");
  });

  it("should not be able to authenticate an user with an invalid user email", () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);

      const auth = await authenticateUserUseCase.execute({
        email: "invalid email",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with an invalid user password", () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      };

      await createUserUseCase.execute(user);

      const auth = await authenticateUserUseCase.execute({
        email: user.email,
        password: "invalid password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
