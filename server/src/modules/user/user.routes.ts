import { UserController } from "@server/modules/user/user.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";
import { sameUserMiddleware } from "@server/middlewares/sameUserMiddleware.js";
import express from "express";

const userRouter = express.Router({ mergeParams: true });
const userController = new UserController();

// security regarding ids will be fixed with auth implementation
userRouter.get(
  "/:id",
  authMiddleware,
  sameUserMiddleware,
  userController.findUserById,
);
userRouter.patch(
  "/:id",
  authMiddleware,
  sameUserMiddleware,
  userController.updateUserById,
);
userRouter.delete(
  "/:id",
  authMiddleware,
  sameUserMiddleware,
  userController.deleteUserById,
);

export default userRouter;
