import UserRepository from "./user.repository.js";
import type { User, NewUser } from "./user.modules.js";
import NotFoundError from "../../errors/notFoundError.js";

export default class UserService {
  private readonly userRepository = new UserRepository();

  // password hashing will be implemented
  async createUser(email: string, password: string): Promise<User | null> {
    const createdUser = await this.userRepository.createUser(email, password);
    return createdUser;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.getUserById(id);

    if (user) {
      throw new NotFoundError(
        "No user with such ID was found in database! Can't get info of non-existing user.",
      );
    }

    return user;
  }

  async updateUser(
    id: number,
    payload: Partial<NewUser>,
  ): Promise<User | null> {
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
