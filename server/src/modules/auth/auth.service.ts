import bcrypt from "bcrypt";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import jwt from "jsonwebtoken";

export class AuthService {

  createAccessToken(userId: number, userEmail: string) {
    const jwtSecret = getEnvOrThrow("JWT_SECRET");
    const payload = {
      userid: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "10m" });
  }

  createRefreshToken(userId: number, userEmail: string) {
    const jwtRefreshSecret = getEnvOrThrow("JWT_REFRESH_SECRET");
    const payload = {
      userid: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: 7884000 }); // expires in 3 months
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
