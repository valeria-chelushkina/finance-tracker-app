import { Request, Response } from "express";
import {
  Category,
  CreateCategoryBody,
  CreateCategory,
} from "@server/types/modules/categoryTypes.js";
import { CategoryRepository } from "@server/modules/category/category.repository.js";
import { CategoryService } from "@server/modules/category/category.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";
import type {
  BodyParameters,
  UpdateBodyParameters,
} from "@server/types/controllerTypes.js";

export class CategoryController extends BaseController<
  Category,
  CreateCategory,
  CreateCategoryBody,
  CategoryRepository,
  CategoryService
> {
  constructor() {
    super(new CategoryRepository(), new CategoryService(), "category");
  }

  createCategory = async (
    req: Request<unknown, unknown, CreateCategoryBody>,
    res: Response,
  ) => {
    return this.create(req, res);
  };

  getCategoriesByUserId = async (req: Request, res: Response) => {
    return this.getByUserId(req, res);
  };

  updateCategory = async (
    req: Request<unknown, unknown, UpdateBodyParameters<Category>>,
    res: Response,
  ) => {
    return this.update(req, res);
  };

  deleteCategory = async (
    req: Request<unknown, unknown, BodyParameters>,
    res: Response,
  ) => {
    return this.delete(req, res);
  };
}
