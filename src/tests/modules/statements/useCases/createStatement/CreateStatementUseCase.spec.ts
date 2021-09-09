import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "@modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "@modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Salary",
    });
    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement with an invalid user id", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalid user_id",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Salary",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new withdraw type statement without funds", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Salary",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
