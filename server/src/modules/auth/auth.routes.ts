import { Router } from "express";
import { AuthController } from "@server/modules/auth/auth.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.patch(
  "/resetPassword",
  authMiddleware,
  authController.resetPassword,
);
