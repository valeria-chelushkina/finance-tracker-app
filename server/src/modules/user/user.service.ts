import { UserRepository } from "@server/modules/user/user.repository.js";
import type { User, UpdateUser } from "@server/modules/user/user.module.js";
import { NotFoundError, ValidationError } from "@server/errors/AppErrors.js";

export class UserService {
  private readonly userRepository = new UserRepository();

  async findUserById(id: number): Promise<User | null> {
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
  ): Promise<User | null> {
    if (!payload) {
      throw new ValidationError("Payload is empty, nothing to update.");
    }
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
