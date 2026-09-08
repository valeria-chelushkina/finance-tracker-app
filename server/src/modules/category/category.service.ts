import { CategoryRepository } from "@server/modules/category/category.repository.js";
import type {
  Category,
  CreateCategory,
} from "@server/types/modules/categoryTypes.js";
import { AppError, NotFoundError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";
import { BaseService } from "@server/modules/base/base.service.js";

export class CategoryService extends BaseService<
  Category,
  CreateCategory,
  CategoryRepository
> {
  constructor() {
    super(new CategoryRepository(), "category");
  }

  async createCategory(payload: CreateCategory): Promise<Category> {
    return this.create(payload);
  }

  async getCategoryByMcc(mcc: number, originalMcc: number): Promise<Category> {
    const categoryMcc = await this.repository.findCategoryByMcc(mcc);
    const categoryOriginalMcc =
      await this.repository.findCategoryByMcc(originalMcc);

    if (!categoryMcc && !categoryOriginalMcc) {
      throw new NotFoundError(
        ErrorMessages.notFoundByField("category", "mcc code"),
      );
    }

    const returnCategory = categoryMcc ? categoryMcc! : categoryOriginalMcc!;

    return returnCategory;
  }
}
