import { Request } from "express";
import type { UserPayload } from "@server/types/generalTypes.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
