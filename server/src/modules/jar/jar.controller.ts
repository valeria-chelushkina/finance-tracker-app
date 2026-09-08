import {
  Jar,
  CreateJarBody,
  CreateJar,
} from "@server/types/modules/jarTypes.js";
import { JarRepository } from "@server/modules/jar/jar.repository.js";
import { JarService } from "@server/modules/jar/jar.service.js";
import { BaseController } from "@server/modules/base/base.controller.js";

export class JarController extends BaseController<
  Jar,
  CreateJar,
  CreateJarBody,
  JarRepository,
  JarService
> {
  constructor(service = new JarService()) {
    super(service.repository, service);
  }

  createJar = this.create;
  getJarsByUserId = this.getByUserId;
  updateJar = this.update;
  deleteJar = this.delete;
}
