import bcrypt from "bcrypt";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import {
  AuthError,
  ConflictError,
} from "@server/errors/AppErrors.js";
import type {
  AuthTokens,
  ResetPasswordBody,
} from "@server/modules/auth/typedefs.js";
import type { UserPayload, UserInfo } from "@server/types/generalTypes.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import type { User } from "@server/modules/user/user.module.js";
import jwt from "jsonwebtoken";
import {
  TOKEN_AGES,
  JWT_SECRET_NAMES,
} from "@server/modules/auth/constants.js";
import type { SignOptions } from "jsonwebtoken";

export type PasswordHashPair = {
  password: string;
  passwordHash: string;
};

export type JwtCredentials = {
  token: string;
  secret: string;
};

export class AuthService {
  private readonly userRepository = new UserRepository();

  private generateToken(
    tokenSecretName: string,
    userPayload: UserPayload,
    tokenOptions: SignOptions,
  ): string {
    const jwtSecret: string = tokenSecretName;
    const payload: UserPayload = {
      userId: userPayload.userId,
      userEmail: userPayload.userEmail,
    };
    return jwt.sign(payload, jwtSecret, tokenOptions);
  }

  createAccessToken(userPayload: UserPayload): string {
    const accessTokenOptions: SignOptions = {
      expiresIn: TOKEN_AGES.ACCESS_TOKEN_AGE,
    };
    return this.generateToken(
      getEnvOrThrow(JWT_SECRET_NAMES.ACCESS_TOKEN),
      userPayload,
      accessTokenOptions,
    );
  }

  createRefreshToken(userPayload: UserPayload): string {
    const refreshTokenOptions: SignOptions = {
      expiresIn: TOKEN_AGES.REFRESH_TOKEN_AGE,
    };
    return this.generateToken(
      getEnvOrThrow(JWT_SECRET_NAMES.REFRESH_TOKEN),
      userPayload,
      refreshTokenOptions,
    );
  }

  verifyToken(jwtCredentials: JwtCredentials): UserPayload {
    try {
      const { token, secret } = jwtCredentials;
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

  async verifyPassword(passwordHashed: PasswordHashPair): Promise<boolean> {
    return await bcrypt.compare(
      passwordHashed.password,
      passwordHashed.passwordHash,
    );
  }

  async resetPassword(
    userId: number,
    resetPasswordBody: ResetPasswordBody,
  ): Promise<void> {
    const { oldPassword, newPassword } = resetPasswordBody;

    const user: User | null = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AuthError(
        "User is not found in database. Cannot reset the password.",
      );
    }
    const isPasswordCorrect: boolean = await this.verifyPassword({
      password: oldPassword,
      passwordHash: user.passwordHash,
    });
    if (!isPasswordCorrect) {
      throw new AuthError("Password is incorrect. Cannot reset the password.");
    }
    const newPasswordHashed: string = await this.hashPassword(newPassword);
    await this.userRepository.updateUser(userId, {
      passwordHash: newPasswordHashed,
    });
  }

  async registerUser(userInfo: UserInfo): Promise<AuthTokens> {
    const { userEmail, userPassword } = userInfo;

    const existingUser: User | null =
      await this.userRepository.findUserByEmail(userEmail);

    if (existingUser) {
      throw new ConflictError(`User with email ${userEmail} already exists.`);
    }

    const hashedPassword = await this.hashPassword(userPassword);

    const newUser: User | null = await this.userRepository.createUser({
      userEmail,
      userPassword: hashedPassword,
    });

    if (!newUser) {
      throw new Error("Something went wrong when creating a new user.");
    }

    const userId: number = Number(newUser.id);

    const accessToken: string = this.createAccessToken({ userId, userEmail });
    const refreshToken: string = this.createRefreshToken({ userId, userEmail });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async loginUser(userInfo: UserInfo): Promise<AuthTokens> {
    const { userEmail, userPassword } = userInfo;

    const existingUser: User | null =
      await this.userRepository.findUserByEmail(userEmail);

    if (!existingUser) {
      throw new AuthError(`User with email ${userEmail} doesn't exist.`);
    }

    const userId: number = Number(existingUser.id);

    const isPasswordCorrect: boolean = await this.verifyPassword({
      password: userPassword,
      passwordHash: existingUser.passwordHash,
    });

    if (!isPasswordCorrect) {
      throw new AuthError(`Password is incorrect!`);
    }

    const accessToken: string = this.createAccessToken({ userId, userEmail });
    const refreshToken: string = this.createRefreshToken({ userId, userEmail });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  refreshToken(refreshToken: string): string {
    if (!refreshToken) {
      throw new AuthError("Refresh token missing from cookies.");
    }

    const decodedUser: UserPayload = this.verifyToken({
      token: refreshToken,
      secret: getEnvOrThrow(JWT_SECRET_NAMES.REFRESH_TOKEN),
    });

    const { userId, userEmail } = decodedUser;

    const accessToken: string = this.createAccessToken({ userId, userEmail });

    return accessToken;
  }
}
