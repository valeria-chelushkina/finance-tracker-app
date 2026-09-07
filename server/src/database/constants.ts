import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";

const DATABASE_NAME = getEnvOrThrow("DATABASE_NAME");
const DATABASE_USER = getEnvOrThrow("DATABASE_USER");
const DATABASE_PASSWORD = getEnvOrThrow("DATABASE_PASSWORD");
const DATABASE_PORT = getEnvOrThrow("DATABASE_PORT");
export const DATABASE_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}`;
