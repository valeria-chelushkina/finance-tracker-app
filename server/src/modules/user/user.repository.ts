import type { User, UpdateUser } from "@server/types/modules/userTypes.js"
import { UserInfo } from "@server/types/generalTypes.js";
import { users } from "@server/modules/user/user.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq } from "drizzle-orm";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class UserRepository extends BaseRepository<
  typeof users,
  User,
  UpdateUser
> {
  constructor(dbClient: DbClient = db) {
    super(users, dbClient);
  }

  async createUser(userInfo: UserInfo): Promise<User> {
    const { userEmail, userPassword } = userInfo;
    const [createdUser] = await this.dbClient
      .insert(users)
      .values({ email: userEmail, passwordHash: userPassword })
      .returning();
    return createdUser;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.findById(id);
  }

  async updateUser(
    id: number,
    updatedFields: Partial<UpdateUser>,
  ): Promise<User | null> {
    return this.update(id, updatedFields);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.delete(id);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.dbClient
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user[0] || null;
  }
}
