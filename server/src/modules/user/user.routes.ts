import { Router } from "express";
import { UserController } from "@server/modules/user/user.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/", authMiddleware, userController.getUserById);
userRouter.patch("/", authMiddleware, userController.updateUserById);
userRouter.delete("/", authMiddleware, userController.deleteUserById);

export default userRouter;
