import { UserRepository } from "@server/modules/user/user.repository.js";
import type {
  User,
  UpdateUser,
  SafeUser,
} from "@server/modules/user/user.module.js";
import { NotFoundError } from "@server/errors/AppError.js";
import { hashPassword } from "@server/helpers/authHelpers.js";

export class UserService {
  private readonly userRepository = new UserRepository();

  async createUser(email: string, password: string): Promise<User | null> {
    const hashedPassword: string = await hashPassword(password);
    const createdUser = await this.userRepository.createUser(
      email,
      hashedPassword,
    );
    return createdUser;
  }

  async findUserById(id: number): Promise<SafeUser | null> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundError(
        "No user with such ID was found in database! Can't get info of non-existing user.",
      );
    }

    return user;
  }

  async updateUser(
    id: number,
    payload: Partial<UpdateUser>,
  ): Promise<SafeUser | null> {
    const updatedUser = await this.userRepository.updateUser(id, payload);
    if (!updatedUser) {
      throw new NotFoundError(
        "No user with such ID was found in database! Can't update non-existing user.",
      );
    }
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUser = await this.userRepository.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundError(
        "No user with such ID was found in database! Can't delete non-existing user.",
      );
    }

    return deletedUser;
  }
}
