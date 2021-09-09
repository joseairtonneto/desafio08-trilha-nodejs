import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { StatementsRepository } from "@modules/statements/repositories/StatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { container } from "tsyringe";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IStatementsRepository>(
  "StatementsRepository",
  StatementsRepository
);
