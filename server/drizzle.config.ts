import { defineConfig } from "drizzle-kit";
import { getEnvOrThrow } from "./src/utils/getEnvOrThrow.js";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/database/schema.ts", "./src/modules/user/user.module.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: getEnvOrThrow("DATABASE_URL"),
  },
});
