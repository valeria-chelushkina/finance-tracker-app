import type { Category, UpdateCategory } from "@server/modules/category/category.module.js";
import { categories } from "@server/modules/category/category.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq, arrayOverlaps } from "drizzle-orm";

export class CategoryRepository {
  private readonly dbClient: DbClient;

  constructor(dbClient: DbClient = db) {
    this.dbClient = dbClient;
  }

  async createCategory(payload: Omit<Category, "id">): Promise<Category> {
    const [newCategory] = await this.dbClient
      .insert(categories)
      .values(payload)
      .returning();
    return newCategory;
  }

  async findCategoryByMcc(mcc: number): Promise<Category | null> {
    const category = await this.dbClient
      .select()
      .from(categories)
      .where(arrayOverlaps(categories.mccCodes, [mcc]))
      .limit(1);
    return category[0] || null;
  }

  async findCategoryById(id: number): Promise<Category | null> {
    const category = await this.dbClient
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return category[0] || null;
  }

  async findCategoriesByUserId(id: number): Promise<Category[]> {
    const userCategories = await this.dbClient
      .select()
      .from(categories)
      .where(eq(categories.userId, id));

    return userCategories;
  }

  async updateCategory(
    id: number,
    updatedFields: Partial<UpdateCategory>,
  ): Promise<Category | null> {
    const [updatedCategory] = await this.dbClient
      .update(categories)
      .set(updatedFields)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || null;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const deletedCategory = await this.dbClient
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });

    if (deletedCategory.length > 0) {
      return true;
    }

    return false;
  }
}
