import { users } from "@server/modules/user/user.module.js";

export type User = typeof users.$inferSelect;

// export type UserWithoutId = typeof users.$inferInsert;

export type UpdateUser = Partial<
  Omit<typeof users.$inferInsert, "email" | "createdAt" | "updatedAt">
>;
