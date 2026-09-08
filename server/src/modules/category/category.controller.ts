import {
  Category,
  CreateCategoryBody,
  CreateCategory,
} from "@server/types/modules/categoryTypes.js";
import { CategoryRepository } from "@server/modules/category/category.repository.js";
import { CategoryService } from "@server/modules/category/category.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";

export class CategoryController extends BaseController<
  Category,
  CreateCategory,
  CreateCategoryBody,
  CategoryRepository,
  CategoryService
> {
  constructor(service = new CategoryService()) {
    super(service.repository, service, "category");
  }

  createCategory = this.create;
  getCategoriesByUserId = this.getByUserId;
  updateCategory = this.update;
  deleteCategory = this.delete;
}
