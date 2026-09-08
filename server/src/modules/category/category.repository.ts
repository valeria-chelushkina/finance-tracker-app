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

  async findCategoryByMcc(mcc: number): Promise<Category | null> {
    const category = await this.dbClient
      .select()
      .from(categories)
      .where(arrayOverlaps(categories.mccCodes, [mcc]))
      .limit(1);
    return category[0] || null;
  }
}
