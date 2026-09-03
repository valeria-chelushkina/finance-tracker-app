import { UserService } from "@server/modules/user/user.service.js";
import { Request, Response } from "express";
import type { User, UpdateUser } from "@server/modules/user/user.module.js";
import {
  COOKIE_NAMES,
  cookieAccessOptions,
  cookieRefreshOptions,
} from "@server/modules/auth/constants.js";

export class UserController {
  private readonly userService = new UserService();

  findUserById = async (req: Request, res: Response) => {
    const userId: number = req.user!.userId;

    const user: User | null = await this.userService.findUserById(userId);
    res.status(200).json(user);
  };

  // will need to control that password can be reset only from /auth/resetPassword endpoint
  updateUserById = async (
    req: Request<unknown, unknown, UpdateUser>,
    res: Response,
  ) => {
    const userPayload: UpdateUser = req.body || {};
    const userId: number = req.user!.userId;

    const user: User | null = await this.userService.updateUser(
      userId,
      userPayload,
    );
    res.status(200).json(user);
  };

  deleteUserById = async (req: Request, res: Response) => {
    const userId: number = req.user!.userId;

    await this.userService.deleteUser(userId);
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieAccessOptions);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieRefreshOptions);
    res
      .status(200)
      .json({ message: `User ${userId} had been deleted from the system.` });
  };
}
