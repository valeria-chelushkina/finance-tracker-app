import {
  AppError,
  NotFoundError,
  ConflictError,
} from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";

import { BaseRepository } from "@server/modules/base/base.repository.js";

export abstract class BaseService<
  TSelect,
  TCreate extends Record<string, any>,
  TRepository extends BaseRepository<any, TSelect, TCreate, any>,
> {
  readonly repository: TRepository;
  protected readonly entityName: string;

  constructor(repository: TRepository, name: string) {
    this.repository = repository;
    this.entityName = name;
  }

  async create(payload: TCreate): Promise<TSelect> {
    if (payload.id) {
      const entity = await this.repository.findById(payload.id);
      if (entity) {
        throw new ConflictError(
          ErrorMessages.alreadyExists(this.entityName, "ID"),
        );
      }
    }

    const newEntity = await this.repository.create(payload);

    if (!newEntity) {
      throw new AppError(ErrorMessages.createFailed(this.entityName), 500);
    }

    return newEntity;
  }

  async getById(id: string | number): Promise<TSelect> {
    const entity = await this.repository.findById(id);

    if (!entity) {
      throw new NotFoundError(ErrorMessages.notFoundById(this.entityName, id));
    }

    return entity;
  }
}
