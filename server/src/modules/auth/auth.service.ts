import bcrypt from "bcrypt";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import jwt from "jsonwebtoken";

export class AuthService {

  createAccessToken(userId: number, userEmail: string) {
    const jwtSecret = getEnvOrThrow("JWT_SECRET");
    const payload = {
      time: Date(),
      userid: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "15m" });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }

  async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

}
