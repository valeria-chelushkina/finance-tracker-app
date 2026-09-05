import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";

const DABATASE_NAME = getEnvOrThrow("DABATASE_NAME");
const DABATASE_USER = getEnvOrThrow("DABATASE_USER");
const DABATASE_PASSWORD = getEnvOrThrow("DABATASE_PASSWORD");
const DABATASE_PORT = getEnvOrThrow("DABATASE_PORT");
export const DATABASE_URL = `postgresql://${DABATASE_USER}:${DABATASE_PASSWORD}@localhost:${DABATASE_PORT}/${DABATASE_NAME}`;
