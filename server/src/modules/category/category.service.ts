import { CategoryRepository } from "@server/modules/category/category.repository.js";
import type { Category } from "@server/modules/category/category.module.js";
import { AppError, NotFoundError } from "@server/errors/AppErrors.js";

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

  async getCategoryByMcc(mcc: number, originalMcc: number): Promise<Category> {
    const categoryMcc: Category | null =
      await this.categoryRepository.findCategoryByMcc(mcc);
    const categoryOriginalMcc: Category | null =
      await this.categoryRepository.findCategoryByMcc(originalMcc);

    if (!categoryMcc && !categoryOriginalMcc) {
      throw new NotFoundError(
        "No category with such mcc was found in database!",
      );
    }

    const returnCategory: Category = categoryMcc
      ? categoryMcc!
      : categoryOriginalMcc!;

    return returnCategory;
  }
}
