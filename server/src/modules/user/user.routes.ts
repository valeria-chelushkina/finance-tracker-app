import { UserController } from "@server/modules/user/user.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";
import express from "express";

const userRouter = express.Router({ mergeParams: true });
const userController = new UserController();

userRouter.get("/", authMiddleware, userController.findUserById);
userRouter.patch("/", authMiddleware, userController.updateUserById);
userRouter.delete("/", authMiddleware, userController.deleteUserById);

export default userRouter;
