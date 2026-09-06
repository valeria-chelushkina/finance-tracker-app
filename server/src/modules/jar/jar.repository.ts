import type { Jar, UpdateJar } from "@server/modules/jar/jar.module.js";
import { jars } from "@server/modules/jar/jar.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { eq } from "drizzle-orm";

export class JarRepository {
  private readonly dbClient: DbClient;

  constructor(dbClient: DbClient = db) {
    this.dbClient = dbClient;
  }

  async createJar(payload: Omit<Jar, "id">): Promise<Jar> {
    const [newJar] = await this.dbClient
      .insert(jars)
      .values(payload)
      .returning();
    return newJar;
  }

  async findJarByJarId(cardId: string): Promise<Jar | null> {
    const jar = await this.dbClient
      .select()
      .from(jars)
      .where(eq(jars.jarId, cardId))
      .limit(1);
    return jar[0] || null;
  }

  async findJarById(id: number): Promise<Jar | null> {
    const jar = await this.dbClient
      .select()
      .from(jars)
      .where(eq(jars.id, id))
      .limit(1);
    return jar[0] || null;
  }

  async findJarsByUserId(id: number): Promise<Jar[]> {
    const userJars = await this.dbClient
      .select()
      .from(jars)
      .where(eq(jars.userId, id));

    return userJars;
  }

  async updateJar(
    id: number,
    updatedFields: Partial<UpdateJar>,
  ): Promise<Jar | null> {
    const [updatedJar] = await this.dbClient
      .update(jars)
      .set(updatedFields)
      .where(eq(jars.id, id))
      .returning();
    return updatedJar || null;
  }

  async deleteJar(id: number): Promise<boolean> {
    const deletedJar = await this.dbClient
      .delete(jars)
      .where(eq(jars.id, id))
      .returning({ id: jars.id });

    if (deletedJar.length > 0) {
      return true;
    }

    return false;
  }
}
