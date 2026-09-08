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
}
