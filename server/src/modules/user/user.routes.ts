import UserController from "@server/modules/user/user.controller.js";
import express from "express";

const userRouter = express.Router({ mergeParams: true });
const userController = new UserController();

// security regarding ids will be fixed with auth implementation
userRouter.get("/", userController.findUser);
userRouter.patch("/", userController.updateUser);
userRouter.delete("/", userController.deleteUser);

export default userRouter;
