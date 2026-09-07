import * as crypto from "crypto";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { ValidationError } from "@server/errors/AppErrors.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export function encryptToken(token: string): string {
  const key: Buffer = convertTokenKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted: string = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decryptToken(encryptedToken: string): string {
  const key: Buffer = convertTokenKey();
  const [ivHex, authTagHex, ciphertextHex] = encryptedToken.split(":");
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new ValidationError("Invalid encrypted data format.");
  }

  const iv: Buffer = Buffer.from(ivHex, "hex");
  const authTag: Buffer = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted: string = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

function convertTokenKey(): Buffer {
  const hexSecretKey: string = getEnvOrThrow("BANK_TOKEN_KEY");
  return Buffer.from(hexSecretKey, "hex");
}
