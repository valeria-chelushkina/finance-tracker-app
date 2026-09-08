import { Router } from "express";
import { JarController } from "@server/modules/jar/jar.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const jarRouter = Router({ mergeParams: true });
const jarController = new JarController();

jarRouter.post("/", authMiddleware, jarController.createJar);
jarRouter.get("/", authMiddleware, jarController.getJarsByUserId);
jarRouter.patch("/:id", authMiddleware, jarController.updateJar);
jarRouter.delete("/:id", authMiddleware, jarController.deleteJar);
