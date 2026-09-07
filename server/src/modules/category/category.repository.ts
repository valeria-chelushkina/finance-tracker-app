import type {
  Category,
  UpdateCategory,
} from "@server/modules/category/category.module.js";
import { categories } from "@server/modules/category/category.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { arrayOverlaps } from "drizzle-orm";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class CategoryRepository extends BaseRepository<
  typeof categories,
  Category,
  UpdateCategory
> {
  constructor(dbClient: DbClient = db) {
    super(categories, dbClient);
  }

  async createCategory(payload: Omit<Category, "id">): Promise<Category> {
    return this.create(payload);
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.findById(id);
  }

  async findCategoriesByUserId(id: number): Promise<Category[]> {
    return this.findByUserId(id);
  }

  async updateCategory(
    id: number,
    updatedFields: Partial<UpdateCategory>,
  ): Promise<Category | null> {
    return this.update(id, updatedFields);
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.delete(id);
  }

  async findCategoryByMcc(mcc: number): Promise<Category | null> {
    const category = await this.dbClient
      .select()
      .from(categories)
      .where(arrayOverlaps(categories.mccCodes, [mcc]))
      .limit(1);
    return category[0] || null;
  }
}
