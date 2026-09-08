import { Router } from "express";
import { JarController } from "@server/modules/jar/jar.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const jarRouter = Router();
const jarController = new JarController();

jarRouter.post("/", authMiddleware, jarController.createJar);
jarRouter.get("/", authMiddleware, jarController.getJarsByUserId);
jarRouter.patch("/", authMiddleware, jarController.updateJar);
jarRouter.delete("/", authMiddleware, jarController.deleteJar);
