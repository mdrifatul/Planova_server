import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/enums";
import { IRequestUser } from "../interfaces/requestUser.interface";

export const checkAuth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken =
        req.cookies["__Secure-session_token"] || req.cookies["session_token"];
      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      const user: IRequestUser = {
        id: sessionToken.user.id,
        email: sessionToken.user.email,
        role: (sessionToken.user.role as Role) || Role.USER,
      };
      req.user = user;
      if (roles.length && !roles.includes(req.user.role as Role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorize to access this resource!",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
