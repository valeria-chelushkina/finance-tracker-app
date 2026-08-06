import UserService from "@server/modules/user/user.service.js";
import express from "express";
import type { SafeUser } from "@server/modules/user/user.module.js";
import NotFoundError from "@server/errors/notFoundError.js";

// auth is not implemented yet
export default class UserController {
  private readonly userService = new UserService();

  findUser = async (req: express.Request, res: express.Response) => {
    try {
      const idCheck = userIdCheck(req, res);
      if (!idCheck.checkStatus) return;

      const user: SafeUser | null = await this.userService.findUserById(
        idCheck.userId,
      );
      res.json(user);
    } catch (err: any) {
      errorHandler(err, res);
    }
  };

  updateUser = async (req: express.Request, res: express.Response) => {
    try {
      const userPayload = req.body || {};
      const idCheck = userIdCheck(req, res);
      if (!idCheck.checkStatus) return;

      const user: SafeUser | null = await this.userService.updateUser(
        idCheck.userId,
        userPayload,
      );
      res.json(user);
    } catch (err: any) {
      errorHandler(err, res);
    }
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    try {
      const idCheck = userIdCheck(req, res);
      if (!idCheck.checkStatus) return;

      const result: boolean = await this.userService.deleteUser(idCheck.userId);
      if (result) {
        res.json(`User ${idCheck.userId} had been deleted from the system.`);
      }
    } catch (err: any) {
      errorHandler(err, res);
    }
  };
}

function errorHandler(err: any, res: express.Response) {
  let statusCode;
  if (err instanceof NotFoundError) {
    statusCode = err.status;
  } else statusCode = 500;
  if (err.message === "No values to set") statusCode = 400;
  res.status(statusCode).json({ type: err.name, message: err.message });
}

function userIdCheck(req: express.Request, res: express.Response) {
  let checkStatus;
  const userId = parseInt(req.params?.id[0], 10);

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    checkStatus = false;
  } else checkStatus = true;
  return { userId, checkStatus };
}
