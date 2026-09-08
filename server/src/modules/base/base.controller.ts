import { Request, Response } from "express";
import { BaseRepository } from "@server/modules/base/base.repository.js";
import { BaseService } from "@server/modules/base/base.service.js";
import { NotFoundError } from "@server/errors/AppErrors.js";
import { ErrorMessages } from "@server/errors/errorMessages.js";

export type BodyParameters = {
  id: string | number;
};

export type UpdateBodyParameters<T> = Partial<T> & {
  id: string | number;
};

export abstract class BaseController<
  TSelect,
  TCreate extends Record<string, any>,
  TCreateBody extends Record<string, any>,
  TRepository extends BaseRepository<any, TSelect, TCreate, any>,
  TService extends BaseService<TSelect, TCreate, TRepository>,
  TUpdateBody extends Record<string, any> = UpdateBodyParameters<TCreateBody>,
> {
  protected readonly repository: TRepository;
  protected readonly service: TService;
  protected readonly entityName: string;

  constructor(repository: TRepository, service: TService) {
    this.repository = repository;
    this.service = service;
    this.entityName = service.entityName;
  }

  protected create = async (
    req: Request<unknown, unknown, TCreateBody>,
    res: Response,
  ) => {
    const userId = req.user.userId;
    const payload = req.body;

    const fullPayload = {
      ...payload,
      userId,
    } as unknown as TCreate;

    const entity = await this.service.create(fullPayload);

    res.status(201).json({
      [this.entityName]: entity,
    });
  };

  protected getByUserId = async (
    req: Request<unknown, unknown, BodyParameters>,
    res: Response,
  ) => {
    const userId = req.user.userId;
    const entities = await this.repository.findByUserId(userId);

    if (entities.length === 0) {
      throw new NotFoundError(
        ErrorMessages.notFoundByField(this.entityName, "user ID", userId),
      );
    }

    res.status(200).json({
      [`${this.entityName}s`]: entities,
    });
  };

  protected update = async (
    req: Request<unknown, unknown, TUpdateBody>,
    res: Response,
  ) => {
    const userId = req.user.userId;
    const { id, ...updatedFields } = req.body as TUpdateBody;
    const updatedEntity = await this.repository.update(
      id,
      userId,
      updatedFields,
    );
    if (!updatedEntity) {
      throw new NotFoundError(ErrorMessages.notFoundById(this.entityName, id));
    }
    res.status(200).json({
      [`updated ${this.entityName}`]: updatedEntity,
    });
  };

  protected delete = async (
    req: Request<any, any, BodyParameters>,
    res: Response,
  ) => {
    const userId = req.user.userId;
    const id = req.body.id;
    const deletedEntity = await this.repository.delete(id, userId);

    if (!deletedEntity) {
      throw new NotFoundError(ErrorMessages.notFoundById(this.entityName, id));
    }

    res.status(200).json({
      message: `Deleted ${this.entityName.toLowerCase()} with id ${id}.`,
    });
  };
}
