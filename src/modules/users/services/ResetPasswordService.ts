import { injectable, inject } from "tsyringe";
import { isAfter, addHours } from "date-fns";
import AppError from "@shared/errors/AppError";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import IUserTokenRepository from "@modules/users/repositories/IUserTokenRepository";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UserTokenRepository")
    private userTokenRepository: IUserTokenRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token does not exists.");
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User does not exists.");
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired.");
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
