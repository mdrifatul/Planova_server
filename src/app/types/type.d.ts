import { IRequestUser } from "../interfaces/requestUser.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser | null;
    }
  }
}
export {};
