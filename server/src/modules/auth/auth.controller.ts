import { AuthService } from "@server/modules/auth/auth.service.js";
import { Request, Response } from "express";
import type { AuthTokens, ResetPasswordBody } from "@server/modules/auth/typedefs.js";
import type { UserInfo } from "@server/types/generalTypes.js";
import {
  COOKIE_NAMES,
  cookieAccessOptions,
  cookieRefreshOptions,
} from "@server/modules/auth/constants.js";

export class AuthController {
  private readonly authService = new AuthService();

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
    const refreshToken: string = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

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
    const userId: number = req.user!.userId;

    const { oldPassword, newPassword } = req.body;

    await this.authService.resetPassword(userId, { oldPassword, newPassword });
    res.status(200).json({ message: "Reset password successfully." });
  };
}
