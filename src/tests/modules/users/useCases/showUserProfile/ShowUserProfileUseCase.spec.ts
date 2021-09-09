import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "@modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "@modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show an user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1234",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toEqual(user);
  });

  it("should not be able to show an user profile with an invalid user id", async () => {
    expect(
      async () => await showUserProfileUseCase.execute("invalid user id")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
