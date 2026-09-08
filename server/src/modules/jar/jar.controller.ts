import { Request, Response } from "express";
import {
  Jar,
  CreateJarBody,
  CreateJar,
} from "@server/types/modules/jarTypes.js";
import { JarRepository } from "@server/modules/jar/jar.repository.js";
import { JarService } from "@server/modules/jar/jar.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";
import type {
  BodyParameters,
  UpdateBodyParameters,
} from "@server/types/controllerTypes.js";

export class JarController extends BaseController<
  Jar,
  CreateJar,
  CreateJarBody,
  JarRepository,
  JarService
> {
  constructor() {
    super(new JarRepository(), new JarService(), "jar");
  }

  createJar = async (
    req: Request<unknown, unknown, CreateJarBody>,
    res: Response,
  ) => {
    return this.create(req, res);
  };

  getJarsByUserId = async (req: Request, res: Response) => {
    return this.getByUserId(req, res);
  };

  updateJar = async (
    req: Request<unknown, unknown, UpdateBodyParameters<Jar>>,
    res: Response,
  ) => {
    return this.update(req, res);
  };

  deleteJar = async (
    req: Request<unknown, unknown, BodyParameters>,
    res: Response,
  ) => {
    return this.delete(req, res);
  };
}
