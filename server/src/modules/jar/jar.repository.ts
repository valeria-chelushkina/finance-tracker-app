import type {
  Jar,
  UpdateJar,
} from "@server/types/modules/jarTypes.js";
import { jars } from "@server/modules/jar/jar.module.js";
import { db, DbClient } from "@server/database/databaseClient.js";
import { BaseRepository } from "@server/modules/base/base.repository.js";

export class JarRepository extends BaseRepository<
  typeof jars,
  Jar,
  Jar,
  UpdateJar
> {
  constructor(dbClient: DbClient = db) {
    super(jars, dbClient);
  }

  async createJar(payload: Jar): Promise<Jar> {
    return this.create(payload);
  }

  async findJarById(id: number): Promise<Jar | null> {
    return this.findById(id);
  }

  async findJarsByUserId(id: number): Promise<Jar[]> {
    return this.findByUserId(id);
  }

  async updateJar(
    id: number,
    updatedFields: Partial<UpdateJar>,
  ): Promise<Jar | null> {
    return this.update(id, updatedFields);
  }

  async deleteJar(id: number): Promise<boolean> {
    return this.delete(id);
  }

}
