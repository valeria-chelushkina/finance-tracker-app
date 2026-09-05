import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/database/db.consts";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/database/schema.ts", "./src/modules/user/user.module.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
