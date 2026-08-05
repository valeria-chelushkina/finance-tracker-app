import UserService from "./user.service.js";
import express from "express";
import type { User, NewUser } from "./user.modules.js";

// auth is not implemented yet
export default class UserController {
  private readonly userService = new UserService();

  getUser = async (req: express.Request, res: express.Response) => {
    try {
      const userId: number = req.body.id;
      const user: User | null = await this.userService.getUserById(userId);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };

  updateUser = async (req: express.Request, res: express.Response) => {
    try {
      const userId: number = req.body.id;
      const userPayload: Partial<NewUser> = req.body;
      const user: User | null = await this.userService.updateUser(
        userId,
        userPayload,
      );
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    try {
      const userId: number = req.body.id;
      const result: boolean = await this.userService.deleteUser(userId);
      if (result) {
        res.json(`User ${userId} had been deleted from the system.`);
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };
}
