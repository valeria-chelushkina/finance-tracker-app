import { CategoryRepository } from "@server/modules/category/category.repository.js";
import type {
  Category,
  CreateCategory,
} from "@server/types/modules/categoryTypes.js";
import { AppError, NotFoundError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";

export class CategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async createCategory(payload: CreateCategory): Promise<Category> {
    const newCategory = await this.categoryRepository.createCategory(payload);
    if (!newCategory) {
      throw new AppError(
        ErrorMessages.createFailed('category'),
        500,
      );
    }
    return newCategory;
  }

  async getCategoryByMcc(mcc: number, originalMcc: number): Promise<Category> {
    const categoryMcc = await this.categoryRepository.findCategoryByMcc(mcc);
    const categoryOriginalMcc =
      await this.categoryRepository.findCategoryByMcc(originalMcc);

    if (!categoryMcc && !categoryOriginalMcc) {
      throw new NotFoundError(
        ErrorMessages.notFoundByField("category", "mcc code"),
      );
    }

    const returnCategory = categoryMcc ? categoryMcc! : categoryOriginalMcc!;

    return returnCategory;
  }
}
