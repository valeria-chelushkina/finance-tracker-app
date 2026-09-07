import { JarRepository } from "@server/modules/jar/jar.repository.js";
import type { Jar } from "@server/types/modules/jarTypes.js";
import { ConflictError, AppError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";

export class JarService {
  private readonly jarRepository = new JarRepository();

  async createJar(payload: Jar): Promise<Jar> {
    const jar = await this.jarRepository.findJarById(payload.id);
    if (jar) {
      throw new ConflictError(ErrorMessages.alreadyExists("Jar", "ID"));
    }
    const newJar = await this.jarRepository.createJar(payload);
    if (!newJar) {
      throw new AppError(ErrorMessages.createFailed('jar'), 500);
    }
    return newJar;
  }
}
