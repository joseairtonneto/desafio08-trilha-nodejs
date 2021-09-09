import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "@modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "@modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to return a statement operation", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    const statement = await statementsRepository.create({
      user_id: user.id as string,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      amount: 100,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toEqual(100);
    expect(statementOperation.type).toEqual(OperationType.DEPOSIT);
  });

  it("should not be able to return a statement operation with an invalid user id", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      });

      const statement = await statementsRepository.create({
        user_id: user.id as string,
        description: "Deposit",
        type: OperationType.DEPOSIT,
        amount: 100,
      });

      await getStatementOperationUseCase.execute({
        user_id: "invalid user_id",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to return a statement operation with an invalid statement id", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "User Test",
        email: "user@test.com",
        password: "1234",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "invalid statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
