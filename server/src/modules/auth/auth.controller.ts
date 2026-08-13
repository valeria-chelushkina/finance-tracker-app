import { AuthService } from "@server/modules/auth/auth.service.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import { AuthError } from "@server/errors/AppError.js";
import { Request, Response } from "express";

export class AuthController {
  private readonly authService = new AuthService();
  private readonly userRepository = new UserRepository();
  /**
   * Login:
   * Get user email and user password.
   * Send info to database -> see if there is such a user with this email there.
   * If yes -> hash password and compare hashes.
   * ** if yes -> you are logged in and send token.
   * ** if no ->  password is incorrect.
   * If no -> user with this email doesn't exist.
   */

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

    res.status(200).json(this.authService.createAccessToken);
  };
}
