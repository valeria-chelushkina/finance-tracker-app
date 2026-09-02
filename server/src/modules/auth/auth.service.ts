import bcrypt from "bcrypt";
import { getEnvOrThrow } from "@server/utils/getEnvOrThrow.js";
import { AuthError, ValidationError } from "@server/errors/AppErrors.js";
import {
  UserPayload,
  AuthTokens,
  ResetPasswordBody,
  PasswordHashPair,
  JwtCredentials,
} from "@server/types/authTypes.js";
import { UserInfo } from "@server/types/generalTypes.js";
import { UserRepository } from "@server/modules/user/user.repository.js";
import { UserService } from "@server/modules/user/user.service.js";
import type { User } from "@server/modules/user/user.module.js";
import jwt from "jsonwebtoken";
import {
  TOKEN_AGES,
  JWT_SECRET_NAMES,
} from "@server/modules/auth/constants.js";

export class AuthService {
  private readonly userRepository = new UserRepository();
  constructor(private readonly userService?: UserService) {}

  createAccessToken(userPayload: UserPayload): string {
    const jwtSecret: string = getEnvOrThrow(JWT_SECRET_NAMES.ACCESS_TOKEN);
    const payload: UserPayload = {
      userId: userPayload.userId,
      userEmail: userPayload.userEmail,
    };
    return jwt.sign(payload, jwtSecret, {
      expiresIn: TOKEN_AGES.ACCESS_TOKEN_AGE,
    });
  }

  createRefreshToken(userPayload: UserPayload): string {
    const jwtRefreshSecret: string = getEnvOrThrow(
      JWT_SECRET_NAMES.REFRESH_TOKEN,
    );
    const payload: UserPayload = {
      userId: userPayload.userId,
      userEmail: userPayload.userEmail,
    };
    return jwt.sign(payload, jwtRefreshSecret, {
      expiresIn: TOKEN_AGES.REFRESH_TOKEN_AGE,
    });
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

  static async hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const hashed: string = await bcrypt.hash(password, saltRounds);
    return hashed;
  }

  static async verifyPassword(
    passwordHashed: PasswordHashPair,
  ): Promise<boolean> {
    return await bcrypt.compare(
      passwordHashed.password,
      passwordHashed.passwordHash,
    );
  }

  async resetPassword(
    userId: number,
    resetPasswordBody: ResetPasswordBody,
  ): Promise<void> {
    if (
      !resetPasswordBody ||
      !resetPasswordBody.newPassword ||
      !resetPasswordBody.oldPassword
    ) {
      throw new ValidationError(
        "Passwords were not provided in request body. Can't reset password.",
      );
    }

    const { oldPassword, newPassword } = resetPasswordBody;

    const user: User | null = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AuthError(
        "User is not found in database. Cannot reset the password.",
      );
    }
    const correctPassword: boolean = await AuthService.verifyPassword({
      password: oldPassword,
      passwordHash: user.passwordHash,
    });
    if (!correctPassword) {
      throw new AuthError("Password is incorrect. Cannot reset the password.");
    }
    const newPasswordHashed: string =
      await AuthService.hashPassword(newPassword);
    await this.userRepository.updateUser(userId, {
      passwordHash: newPasswordHashed,
    });
  }

  async registerUser(userInfo: UserInfo): Promise<AuthTokens> {
    const { userEmail, userPassword } = userInfo;

    if (!userEmail || !userPassword) {
      throw new ValidationError(
        "Email or password were not provided in request body. Can't register.",
      );
    }

    const existingUser: User | null =
      await this.userRepository.findUserByEmail(userEmail);

    if (existingUser) {
      throw new AuthError(`User with email ${userEmail} already exists.`);
    }

    const newUser: User | null | undefined = await this.userService?.createUser(
      { userEmail, userPassword },
    );

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

    if (!userEmail || !userPassword) {
      throw new ValidationError(
        "Email or password were not provided in request body. Can't login.",
      );
    }

    const existingUser: User | null =
      await this.userRepository.findUserByEmail(userEmail);

    if (!existingUser) {
      throw new AuthError(`User with email ${userEmail} doesn't exist.`);
    }

    const userId: number = Number(existingUser.id);

    const correctPassword: boolean = await AuthService.verifyPassword({
      password: userPassword,
      passwordHash: existingUser.passwordHash,
    });

    if (!correctPassword) {
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
