import { Role } from "../../generated/enums";

export interface IRequestUser {
  id: string;
  role: Role;
  email: string;
}
