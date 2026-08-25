import { AuthService } from "@server/modules/auth/auth.service.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import { UserService } from "@server/modules/user/user.service.js";
import { AuthError } from "@server/errors/AppError.js";
import { Request, Response } from "express";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { setCookie } from "@server/utils/cookiesUtils.js";
import { UserPayload } from "@server/types/authTypes.js";

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
    const refreshToken = this.authService.createRefreshToken(
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

  // testing
  verifyToken = async (req: Request, res: Response) => {
    const { accessToken } = req.body;
    console.log(accessToken);
    if (accessToken) {
      this.authService.verifyToken<UserPayload>(
        accessToken,
        getEnvOrThrow("JWT_SECRET"),
      );
      res.status(200).json("Token is valid");
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AuthError("Refresh token missing from cookies.", 401);
    }

    const decodedToken = this.authService.verifyToken<UserPayload>(
      refreshToken,
      getEnvOrThrow("JWT_REFRESH_SECRET"),
    );

    const accessToken = this.authService.createAccessToken(
      decodedToken.id,
      decodedToken.email,
    );

    setCookie(res, "accessToken", accessToken, {
      ageInSeconds: 600,
    });

    res.status(200).json("Access token has been refreshed.");
  };
}
