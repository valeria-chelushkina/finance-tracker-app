import { Router } from "express";
import { CategoryController } from "@server/modules/category/category.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", authMiddleware, categoryController.createCategory);
categoryRouter.get("/", authMiddleware, categoryController.getCategoriesByUserId);
categoryRouter.patch("/", authMiddleware, categoryController.updateCategory);
categoryRouter.delete("/", authMiddleware, categoryController.deleteCategory);
