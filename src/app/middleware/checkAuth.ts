import { NextFunction, Request, Response } from "express";
import { Role } from "../../../generated/prisma/enums";
import { IRequestUser } from "../interfaces/requestUser.interface";
import { auth as betterAuth } from "./../lib/auth";

export const checkAuth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorize!",
      });
    }
    // if (!session.user.emailVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Email verification required. Please verify you email!",
    //   });
    // }
    const user: IRequestUser = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user.role as Role) || Role.USER,
    };
    req.user = user;
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorize to access this resource!",
      });
    }
    next();
  };
};
