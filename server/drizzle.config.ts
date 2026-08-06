import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  out: "./drizzle",
  schema: ['./src/database/schema.ts', './src/modules/user/user.module.ts'],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
