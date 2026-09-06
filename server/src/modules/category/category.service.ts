import { CategoryRepository } from "@server/modules/category/category.repository.js";
import type {
  Category,
  UpdateCategory,
} from "@server/modules/category/category.module.js";
import {
  AppError,
  NotFoundError,
  ValidationError,
} from "@server/errors/AppErrors.js";

export class CategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async createCategory(payload: Omit<Category, "id">): Promise<Category> {
    const newCategory: Category | null =
      await this.categoryRepository.createCategory(payload);
    if (!newCategory) {
      throw new AppError(
        "There was an error while creating new category.",
        500,
      );
    }
    return newCategory;
  }

  async findCategoryById(id: number): Promise<Category> {
    const category: Category | null =
      await this.categoryRepository.findCategoryById(id);

    if (!category) {
      throw new NotFoundError(
        "No category with such ID was found in database!",
      );
    }

    return category;
  }

  async findcategoryByMcc(mcc: number): Promise<Category> {
    const category: Category | null =
      await this.categoryRepository.findCategoryByMcc(mcc);

    if (!category) {
      throw new NotFoundError(
        "No category with such mcc was found in database!",
      );
    }

    return category;
  }

  async findCategoriesByUserId(id: number): Promise<Category[]> {
    const categories: Category[] =
      await this.categoryRepository.findCategoriesByUserId(id);

    if (!categories) {
      throw new NotFoundError(
        "No category with such user ID was found in database!",
      );
    }

    return categories;
  }

  async updateCategory(
    id: number,
    payload: Partial<UpdateCategory>,
  ): Promise<Category> {
    if (!payload) {
      throw new ValidationError("Payload is empty, nothing to update.");
    }
    const updatedCategory: Category | null =
      await this.categoryRepository.updateCategory(id, payload);
    if (!updatedCategory) {
      throw new NotFoundError(
        "No category with such ID was found in database!",
      );
    }
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const deletedCategory: boolean =
      await this.categoryRepository.deleteCategory(id);
    if (!deletedCategory) {
      throw new NotFoundError(
        "No category with such ID was found in database!",
      );
    }

    return deletedCategory;
  }
}
