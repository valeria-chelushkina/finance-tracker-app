import type {
  Category,
  CreateCategory,
  UpdateCategory,
} from "@server/types/modules/categoryTypes.js";
import { categories } from "@server/modules/category/category.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { arrayOverlaps } from "drizzle-orm";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class CategoryRepository extends BaseRepository<
  typeof categories,
  Category,
  CreateCategory,
  UpdateCategory
> {
  constructor(dbClient: DbClient = db) {
    super(categories, dbClient);
  }

  async createCategory(payload: CreateCategory): Promise<Category> {
    return this.create(payload);
  }

  async findCategoryById(id: number): Promise<Category | null> {
    return this.findById(id);
  }

  async findCategoriesByUserId(id: number): Promise<Category[]> {
    return this.findByUserId(id);
  }

  async findCategoryByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Category | null> {
    return this.findByIdAndUserId(id, userId);
  }
  async updateCategory(
    id: number,
    userId: number,
    updatedFields: UpdateCategory,
  ): Promise<Category | null> {
    return this.update(id, userId, updatedFields);
  }

  async deleteCategory(id: number, userId: number): Promise<boolean> {
    return this.delete(id, userId);
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
