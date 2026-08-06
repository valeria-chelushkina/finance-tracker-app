import { UserController } from "@server/modules/user/user.controller.js";
import express from "express";

const userRouter = express.Router({ mergeParams: true });
const userController = new UserController();

// security regarding ids will be fixed with auth implementation
userRouter.get("/:id", userController.findUserById);
userRouter.patch("/:id", userController.updateUserById);
userRouter.delete("/:id", userController.deleteUserById);

export default userRouter;
