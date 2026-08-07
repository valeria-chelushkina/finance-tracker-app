import { drizzle } from "drizzle-orm/node-postgres";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";

const dbUrl = getEnvOrThrow("DATABASE_URL");

export const db = drizzle(dbUrl);
export type DbClient = typeof db;
