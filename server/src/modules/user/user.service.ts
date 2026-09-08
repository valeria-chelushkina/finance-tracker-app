import { UserRepository } from "@server/modules/user/user.repository.js";
import type { User, UpdateUser } from "@server/types/modules/userTypes.js";
import { NotFoundError, ValidationError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";
import { Entities } from "@server/types/entitiesEnum.js";

export class UserService {
  private readonly userRepository = new UserRepository();
  private readonly entityName = Entities.User;

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundError(ErrorMessages.notFoundById(this.entityName, id));
    }

    return user;
  }

  async updateUser(id: number, payload: Partial<UpdateUser>): Promise<User> {
    if (!payload) {
      throw new ValidationError("Payload is empty, nothing to update.");
    }
    const updatedUser = await this.userRepository.updateUser(id, payload);
    if (!updatedUser) {
      throw new NotFoundError(
        ErrorMessages.notFoundById(this.entityName, "id"),
      );
    }
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUser = await this.userRepository.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundError(
        ErrorMessages.notFoundById(this.entityName, "id"),
      );
    }

    return deletedUser;
  }
}
