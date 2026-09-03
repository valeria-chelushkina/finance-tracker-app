import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  userId: number;
  userEmail: string;
}

export type UserInfo = {
  userEmail: string;
  userPassword: string;
};
