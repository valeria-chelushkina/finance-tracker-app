import UserService from "./user.service.js";
import express from "express";
import type { User, NewUser } from "./user.module.js";
import NotFoundError from "../../errors/notFoundError.js";

// auth is not implemented yet
export default class UserController {
  private readonly userService = new UserService();

  getUser = async (req: express.Request, res: express.Response) => {
    try {
      const userId: number | null = req.body?.id;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const user: User | null = await this.userService.getUserById(userId);
      res.json(user);
    } catch (err: any) {
      errorHandler(err, res);
    }
  };

  updateUser = async (req: express.Request, res: express.Response) => {
    try {
      const { id = null, ...userPayload } = req.body || {};

      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const user: User | null = await this.userService.updateUser(
        id,
        userPayload,
      );
      res.json(user);
    } catch (err: any) {
      errorHandler(err, res);
    }
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    try {
      const userId: number | null = req.body?.id;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const result: boolean = await this.userService.deleteUser(userId);
      if (result) {
        res.json(`User ${userId} had been deleted from the system.`);
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
