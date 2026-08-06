import type { User, UpdateUser, SafeUser } from "@server/modules/user/user.module.js";
import { users } from "@server/modules/user/user.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq, getColumns } from "drizzle-orm";

const { passwordHash, ...otherFields } = getColumns(users);

export default class UserRepository {
  private readonly dbClient: DbClient;

  constructor(dbClient: DbClient = db) {
    this.dbClient = dbClient;
  }

  async createUser(email: string, password: string): Promise<User> {
    const [createdUser] = await this.dbClient.insert(users)
      .values({ email: email, passwordHash: password })
      .returning();
    return createdUser;
  }

  async findUserById(id: number): Promise<SafeUser | null> {
    const user = await this.dbClient.select({ ...otherFields })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user[0] || null;
  }

  // cannot change password - will make a separate function
  async updateUser(
    id: number,
    updatedFields: Partial<UpdateUser>,
  ): Promise<SafeUser | null> {
    const [updatedUser] = await this.dbClient.update(users)
      .set(updatedFields)
      .where(eq(users.id, id))
      .returning({ ...otherFields });
    return updatedUser || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUser = await this.dbClient.delete(users)
      .where(eq(users.id, id))
      .returning({ deletedUser: users.id });
    return deletedUser.length > 0;
  }
}
