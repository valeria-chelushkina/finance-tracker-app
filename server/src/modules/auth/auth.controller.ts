import { AuthService } from "@server/modules/auth/auth.service.js";
import { Request, Response } from "express";
import {
  AuthTokens,
  UserInfo,
  ResetPasswordBody,
} from "@server/types/authTypes.js";
import {
  COOKIE_NAMES,
  cookieAccessOptions,
  cookieRefreshOptions,
} from "@server/modules/auth/constants.js";
import { UserService } from "@server/modules/user/user.service.js";
import { getUserAuth } from "@server/middlewares/authMiddleware.js";

export class AuthController {
  private readonly authService = new AuthService(new UserService());

  // (will be done)
  // for login and register -> if user has active, valid tokens (AT or RT) and is already logged in - can't access, will be redirected to the main page
  register = async (
    req: Request<unknown, unknown, UserInfo>,
    res: Response,
  ) => {
    const { userEmail, userPassword } = req.body;

    const userTokens: AuthTokens = await this.authService.registerUser({
      userEmail,
      userPassword,
    });

    res.cookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      userTokens.accessToken,
      cookieAccessOptions,
    );
    res.cookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      userTokens.refreshToken,
      cookieRefreshOptions,
    );

    res.status(201).json({
      message: `Created new user with email ${userEmail}`,
    });
  };

  login = async (req: Request<unknown, unknown, UserInfo>, res: Response) => {
    const { userEmail, userPassword } = req.body;

    const userTokens: AuthTokens = await this.authService.loginUser({
      userEmail,
      userPassword,
    });

    res.cookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      userTokens.accessToken,
      cookieAccessOptions,
    );
    res.cookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      userTokens.refreshToken,
      cookieRefreshOptions,
    );

    res.status(200).json({
      message: `User with email ${userEmail} logged in successfully.`,
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
      res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieAccessOptions);
      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieRefreshOptions);
    }

    const accessToken: string = this.authService.refreshToken(refreshToken);

    if (accessToken) {
      res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, cookieAccessOptions);
    }

    res.status(200).json({ message: "Access token has been refreshed." });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieAccessOptions);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieRefreshOptions);
    res.status(200).json({ message: "User logged out successfully." });
  };

  resetPassword = async (
    req: Request<unknown, unknown, ResetPasswordBody>,
    res: Response,
  ) => {
    const userId: number = getUserAuth(res).userId;

    const { oldPassword, newPassword } = req.body;

    await this.authService.resetPassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Resetted password successfully." });
  };
}
