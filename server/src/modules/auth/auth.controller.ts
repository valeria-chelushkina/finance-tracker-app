import { AuthService } from "@server/modules/auth/auth.service.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import { UserService } from "@server/modules/user/user.service.js";
import { AuthError, ValidationError } from "@server/errors/AppError.js";
import { Request, Response } from "express";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { setCookie, clearCookie } from "@server/utils/cookiesUtils.js";
import { UserPayload } from "@server/types/authTypes.js";
import type { User } from "@server/modules/user/user.module.js";

export class AuthController {
  private readonly authService = new AuthService();
  private readonly userRepository = new UserRepository();
  private readonly userService = new UserService();

  // (will be done)
  // for login and register -> if user has active, valid tokens (AT or RT) and is already logged in - can't access, will be redirected to the main page
  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser: User | null =
      await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AuthError(`User with email ${email} already exists.`);
    }

    const newUser: User | null = await this.userService.createUser(
      email,
      password,
    );

    if (!newUser) {
      throw new Error("Something went wrong when creating a new user.");
    }

    const accessToken: string = this.authService.createAccessToken(newUser.id, email);
    const refreshToken: string = this.authService.createRefreshToken(newUser.id, email);

    setCookie(res, "accessToken", accessToken, {
      ageInSeconds: 600,
    });
    setCookie(res, "refreshToken", refreshToken, {
      ageInSeconds: 7884000,
    });

    res.status(201).json({
      message: "Created new user",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser: User | null = await this.userRepository.findUserByEmail(email);
    if (!existingUser) {
      throw new AuthError(`User with email ${email} doesn't exist.`);
    }

    const correctPassword: boolean = await this.authService.verifyPassword(
      password,
      existingUser.passwordHash,
    );

    if (!correctPassword) {
      throw new AuthError(`Password is incorrect!`);
    }

    const accessToken: string = this.authService.createAccessToken(
      existingUser.id,
      email,
    );
    const refreshToken: string = this.authService.createRefreshToken(
      existingUser.id,
      email,
    );

    setCookie(res, "accessToken", accessToken, {
      ageInSeconds: 600,
    });
    setCookie(res, "refreshToken", refreshToken, {
      ageInSeconds: 7884000,
    });

    res.status(200).json({
      message: "User logged in",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      clearCookie(res, "accessToken");
      clearCookie(res, "refreshToken");
      throw new AuthError("Refresh token missing from cookies.");
    }

    // can i use try...catch here......
    try {
      // checks if RT is valid - will need to redirect to /login page
      const decodedUser: UserPayload = this.authService.verifyToken(
        refreshToken,
        getEnvOrThrow("JWT_REFRESH_SECRET"),
      );

      const accessToken: string = this.authService.createAccessToken(
        decodedUser.userId,
        decodedUser.userEmail,
      );

      setCookie(res, "accessToken", accessToken, {
        ageInSeconds: 600,
      });

      res.status(200).json("Access token has been refreshed.");
    } catch (err) {
      clearCookie(res, "accessToken");
      clearCookie(res, "refreshToken");
      res.redirect("/auth/login");
    }
  };

  logout = async (req: Request, res: Response) => {
    clearCookie(res, "accessToken");
    clearCookie(res, "refreshToken");
    res.status(200).send("User logged out successfully.");
  };

  resetPassword = async (req: Request, res: Response) => {
    const user: UserPayload | undefined = res.locals?.user;

    if (!user) {
      throw new AuthError("User is not authorized. No access.");
    }

    const oldPassword: string = req.body?.oldPassword;
    const newPassword: string = req.body?.newPassword;
    if (!oldPassword || !newPassword) {
      throw new ValidationError(
        "Couldn't find old or new passwords in the request body. Can't reset the password.",
      );
    }

    this.authService.resetPassword(user.userId, oldPassword, newPassword);
    res.status(200).send("Resetted password successfully.");
  };
}
