import { AuthService } from "@server/modules/auth/auth.service.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import { UserService } from "@server/modules/user/user.service.js";
import { AuthError } from "@server/errors/AppError.js";
import { Request, Response } from "express";

export class AuthController {
  private readonly authService = new AuthService();
  private readonly userRepository = new UserRepository();
  private readonly userService = new UserService();

  // right now tokens are not stored in http-only cookies
  signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AuthError(`User with email ${email} already exists.`);
    }

    const newUser = await this.userService.createUser(email, password);
    if (!newUser) throw new Error();

    const accessToken = this.authService.createAccessToken(newUser.id, email);
    const refreshToken = this.authService.createRefreshToken(newUser.id, email);

    res.status(201).json({
      message: "Created new user",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (!existingUser) {
      throw new AuthError(`User with email ${email} doesn't exist.`);
    }

    const passwordIsCorrect = await this.authService.verifyPassword(
      password,
      existingUser.passwordHash,
    );

    if (!passwordIsCorrect) {
      throw new AuthError(`Password is incorrect!`);
    }

    const accessToken = this.authService.createAccessToken(
      existingUser.id,
      email,
    );

    res.status(200).json({
      message: "User logged in",
      accessToken: accessToken,
    });
  };
}
