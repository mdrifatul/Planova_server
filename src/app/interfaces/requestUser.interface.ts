import { Role } from "../../../generated/prisma/enums";

export interface IRequestUser {
  id: string;
  role: Role;
  email: string;
}
