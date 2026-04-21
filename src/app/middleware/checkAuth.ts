import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/enums";
import { IRequestUser } from "../interfaces/requestUser.interface";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const checkAuth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use better-auth's getSession to reliably extract session from request headers
      const sessionData = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!sessionData || !sessionData.session) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      const user: IRequestUser = {
        id: sessionData.user.id,
        email: sessionData.user.email,
        role: (sessionData.user.role as Role) || Role.USER,
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
