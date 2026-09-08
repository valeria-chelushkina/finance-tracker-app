import type {
  Jar,
  CreateJar,
  UpdateJar,
} from "@server/types/modules/jarTypes.js";
import { jars } from "@server/modules/jar/jar.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class JarRepository extends BaseRepository<
  typeof jars,
  Jar,
  CreateJar,
  UpdateJar
> {
  constructor(dbClient: DbClient = db) {
    super(jars, dbClient);
  }

  async createJar(payload: CreateJar): Promise<Jar> {
    return this.create(payload);
  }

  async findJarById(id: number): Promise<Jar | null> {
    return this.findById(id);
  }

  async findJarByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Jar | null> {
    return this.findByIdAndUserId(id, userId);
  }

  async findJarsByUserId(id: number): Promise<Jar[]> {
    return this.findByUserId(id);
  }

  async updateJar(
    id: number,
    userId: number,
    updatedFields: Partial<UpdateJar>,
  ): Promise<Jar | null> {
    return this.update(id, userId, updatedFields);
  }

  async deleteJar(
    id: number,
    userId: number,
  ): Promise<boolean> {
    return this.delete(id, userId);
  }
}
