import { jars } from "@server/modules/jar/jar.module.js";

export type Jar = typeof jars.$inferSelect;

export type CreateJar = typeof jars.$inferInsert;

export type UpdateJar = Partial<Omit<typeof jars.$inferInsert, "userId">>;
