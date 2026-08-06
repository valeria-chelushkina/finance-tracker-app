import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { getEnvOrThrow } from "./src/utils/getEnvOrThrow.js";

dotenv.config();

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/database/schema.ts", "./src/modules/user/user.module.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: getEnvOrThrow("DATABASE_URL"),
  },
});
