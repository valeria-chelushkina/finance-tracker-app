import bcrypt from "bcrypt";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { AuthError } from "@server/errors/AppError.js";
import { UserPayload } from "@server/types/authTypes.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import type { User } from "@server/modules/user/user.module.js";
import jwt from "jsonwebtoken";

export class AuthService {
  private readonly userRepository = new UserRepository();

  createAccessToken(userId: number, userEmail: string): string {
    const jwtSecret: string = getEnvOrThrow("JWT_ACCESS_SECRET");
    const payload: UserPayload = {
      userId: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "10m" });
  }

  createRefreshToken(userId: number, userEmail: string): string {
    const jwtRefreshSecret: string = getEnvOrThrow("JWT_REFRESH_SECRET");
    const payload: UserPayload = {
      userId: userId,
      userEmail: userEmail,
    };
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: 7884000 }); // expires in 3 months
  }

  verifyToken(token: any, secret: string): UserPayload {
    try {
      const decoded = jwt.verify(token, secret) as UserPayload;
      return decoded;
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError("Token is expired.");
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
    const saltRounds: number = 10;
    const hashed: string = await bcrypt.hash(password, saltRounds);
    return hashed;
  }

  async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }

  async resetPassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user: User | null = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AuthError(
        "User is not found in database. Cannot reset the password.",
      );
    }
    const correctPassword: boolean = await this.verifyPassword(
      oldPassword,
      user.passwordHash,
    );
    if (!correctPassword) {
      throw new AuthError("Password is incorrect. Cannot reset the password.");
    }
    const newPasswordHashed: string = await this.hashPassword(newPassword);
    await this.userRepository.updateUser(userId, {
      passwordHash: newPasswordHashed,
    });
  }
}
