import bcrypt from "bcrypt";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { AuthError } from "@server/errors/AppError.js";
import jwt from "jsonwebtoken";

export class AuthService {
  createAccessToken(userId: number, userEmail: string) {
    const jwtSecret = getEnvOrThrow("JWT_SECRET");
    const payload = {
      userid: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "2m" });
  }

  createRefreshToken(userId: number, userEmail: string) {
    const jwtRefreshSecret = getEnvOrThrow("JWT_REFRESH_SECRET");
    const payload = {
      userid: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: 7884000 }); // expires in 3 months
  }

  verifyToken(token: any, secret: string) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError("Token is expired.", 498);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError("Token is invalid.");
      }

      if (error instanceof jwt.NotBeforeError) {
        throw new AuthError("Token is not active.");
      }

      throw new Error("Error while verifying token.");
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }

  async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
