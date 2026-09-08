import { JarRepository } from "@server/modules/jar/jar.repository.js";
import type { Jar, CreateJar } from "@server/types/modules/jarTypes.js";
import { BaseService } from "@server/modules/base/base.service.js";
import { Entities } from "@server/types/entitiesEnum.js";

export class JarService extends BaseService<Jar, CreateJar, JarRepository> {
  constructor() {
    super(new JarRepository(), Entities.Jar);
  }

  async createJar(payload: CreateJar): Promise<Jar> {
    return this.create(payload);
  }
}
