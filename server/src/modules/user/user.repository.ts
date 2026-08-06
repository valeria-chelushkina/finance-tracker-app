import type {
  User,
  NewUser,
  SafeUser,
} from "@server/modules/user/user.module.js";
import { users } from "@server/modules/user/user.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq, getColumns } from "drizzle-orm";

const { passwordHash, ...otherFields } = getColumns(users);

export default class UserRepository {
  private readonly DbClient: DbClient;

  constructor(dbClient: DbClient = db) {
    this.DbClient = dbClient;
  }

  async createUser(email: string, password: string): Promise<User> {
    const [createdUser] = await this.DbClient.insert(users)
      .values({ email: email, passwordHash: password })
      .returning();
    return createdUser;
  }

  async getUserById(id: number): Promise<SafeUser | null> {
    const user = await this.DbClient.select({ ...otherFields })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user[0] || null;
  }

  // cannot change password - will make a separate function
  async updateUser(
    id: number,
    updatedFields: Partial<NewUser>,
  ): Promise<SafeUser | null> {
    const [updatedUser] = await this.DbClient.update(users)
      .set(updatedFields)
      .where(eq(users.id, id))
      .returning({...otherFields});
    return updatedUser || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deletedUser = await this.DbClient.delete(users)
      .where(eq(users.id, id))
      .returning({ deletedUser: users.id });
    return deletedUser.length > 0;
  }
}
