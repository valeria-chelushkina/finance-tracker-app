import { JarRepository } from "@server/modules/jar/jar.repository.js";
import type { Jar, UpdateJar } from "@server/modules/jar/jar.module.js";
import {
  ConflictError,
  AppError,
  NotFoundError,
  ValidationError,
} from "@server/errors/AppErrors.js";

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

  async findJarById(id: number): Promise<Jar> {
    const jar: Jar | null = await this.jarRepository.findJarById(id);

    if (!jar) {
      throw new NotFoundError("No jar with such ID was found in database!");
    }

    return jar;
  }

  async findJarByJarId(jarId: string): Promise<Jar> {
    const jar: Jar | null = await this.jarRepository.findJarByJarId(jarId);

    if (!jar) {
      throw new NotFoundError("No jar with such jar ID was found in database!");
    }

    return jar;
  }

  async findJarsByUserId(id: number): Promise<Jar[]> {
    const jars: Jar[] = await this.jarRepository.findJarsByUserId(id);

    if (!jars) {
      throw new NotFoundError(
        "No jar with such user ID was found in database!",
      );
    }

    return jars;
  }

  async updateJar(id: number, payload: Partial<UpdateJar>): Promise<Jar> {
    if (!payload) {
      throw new ValidationError("Payload is empty, nothing to update.");
    }
    const updatedJar: Jar | null = await this.jarRepository.updateJar(
      id,
      payload,
    );
    if (!updatedJar) {
      throw new NotFoundError("No jar with such ID was found in database!");
    }
    return updatedJar;
  }

  async deleteJar(id: number): Promise<boolean> {
    const deletedJar: boolean = await this.jarRepository.deleteJar(id);
    if (!deletedJar) {
      throw new NotFoundError("No jar with such ID was found in database!");
    }

    return deletedJar;
  }
}
