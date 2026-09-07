import { JarRepository } from "@server/modules/jar/jar.repository.js";
import type { Jar, CreateJar } from "@server/types/modules/jarTypes.js";
import { ConflictError, AppError } from "@server/errors/AppErrors.js";

export class JarService {
  private readonly jarRepository = new JarRepository();

  async createJar(payload: CreateJar): Promise<Jar> {
    const jar = await this.jarRepository.findJarByJarId(
      payload.jarId,
    );
    if (jar) {
      throw new ConflictError("Jar with such jar id already exists.");
    }
    const newJar = await this.jarRepository.createJar(payload);
    if (!newJar) {
      throw new AppError("There was an error while creating new jar.", 500);
    }
    return newJar;
  }
}
