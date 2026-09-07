import { Request, Response } from "express";
import { Jar, UpdateJar } from "@server/types/modules/jarTypes.js";
import { JarRepository } from "@server/modules/jar/jar.repository.js";
import { JarService } from "@server/modules/jar/jar.service.js";

export class JarController {
  createJar = async (req: Request<unknown, unknown, Partial<Jar>>, res: Response) => {
    
  };
}
