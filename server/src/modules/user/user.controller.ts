import { UserService } from "@server/modules/user/user.service.js";
import { Request, Response } from "express";
import type { SafeUser } from "@server/modules/user/user.module.js";
import { stringToIntCheck } from "@server/utils/controllerUtils.js";

// auth is not implemented yet
export class UserController {
  private readonly userService = new UserService();

  findUserById = async (req: Request, res: Response) => {
    const idCheck = stringToIntCheck(req, "id");

    const user: SafeUser | null = await this.userService.findUserById(idCheck);
    res.status(200).json(user);
  };

  updateUserById = async (req: Request, res: Response) => {
    const userPayload = req.body || {};
    const idCheck = stringToIntCheck(req, "id");

    const user: SafeUser | null = await this.userService.updateUser(
      idCheck,
      userPayload,
    );
    res.status(200).json(user);
  };

  deleteUserById = async (req: Request, res: Response) => {
    const idCheck = stringToIntCheck(req, "id");

    await this.userService.deleteUser(idCheck);
    res.status(200).json(`User ${idCheck} had been deleted from the system.`);
  };
}
