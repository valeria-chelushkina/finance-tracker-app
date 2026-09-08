import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/database/constants.ts";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/database/schema.ts", "./src/modules/*/*.module.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
