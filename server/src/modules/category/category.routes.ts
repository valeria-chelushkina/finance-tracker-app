import { Router } from "express";
import { CategoryController } from "@server/modules/category/category.controller.js";
import { authMiddleware } from "@server/middlewares/authMiddleware.js";

export const categoryRouter = Router({ mergeParams: true });
const categoryController = new CategoryController();

categoryRouter.post("/", authMiddleware, categoryController.createCategory);
categoryRouter.get("/", authMiddleware, categoryController.getCategoriesByUserId);
categoryRouter.patch("/:id", authMiddleware, categoryController.updateCategory);
categoryRouter.delete("/:id", authMiddleware, categoryController.deleteCategory);
