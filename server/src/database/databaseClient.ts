import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "@server/database/constants.js";

const dbUrl = DATABASE_URL;

export const db = drizzle(dbUrl);
export type DbClient = typeof db;
