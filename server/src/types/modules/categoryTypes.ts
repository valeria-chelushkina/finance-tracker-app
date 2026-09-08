import { categories } from "@server/modules/category/category.module.js";

export type Category = typeof categories.$inferSelect;

export type CreateCategory = typeof categories.$inferInsert;

export type CreateCategoryBody = Omit<CreateCategory, "userId" | "id">;

export type UpdateCategory = Partial<Omit<typeof categories.$inferInsert, "userId">>;

