import { sign } from "jsonwebtoken";
import { injectable, inject } from "tsyringe";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";
import User from "@modules/users/infra/typeorm/entities/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthUserService {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository,
    @inject("HashProvider") private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Incorrect or nonexistent e-mail.", 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    );
    if (!passwordMatched) {
      throw new AppError("Incorrect password.", 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthUserService;
