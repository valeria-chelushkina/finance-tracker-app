import { JarRepository } from "@server/modules/jar/jar.repository.js";
import type { Jar } from "@server/modules/jar/jar.module.js";
import { ConflictError, AppError } from "@server/errors/AppErrors.js";

export class JarService {
  private readonly jarRepository = new JarRepository();

  async createJar(payload: Omit<Jar, "id">): Promise<Jar> {
    const jar: Jar | null = await this.jarRepository.findJarByJarId(
      payload.jarId,
    );
    if (jar) {
      throw new ConflictError("Jar with such jar id already exists.");
    }
    const newJar: Jar | null = await this.jarRepository.createJar(payload);
    if (!newJar) {
      throw new AppError("There was an error while creating new jar.", 500);
    }
    return newJar;
  }
}
