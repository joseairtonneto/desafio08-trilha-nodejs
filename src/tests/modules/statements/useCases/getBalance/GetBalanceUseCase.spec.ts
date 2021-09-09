import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "@modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "@modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to return the balance with statement", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    const balanceWithStatement = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balanceWithStatement.balance).toBe(0);
    expect(balanceWithStatement.statement).toHaveLength(0);
  });

  it("should not be able to return the balance with an invalid user id", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "invalid user_id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
