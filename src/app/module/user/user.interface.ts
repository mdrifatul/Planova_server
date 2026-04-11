export type TUserRole = "ADMIN" | "ORGANIZER" | "USER" | "MODERATOR";

export interface IUserUpdate {
  name?: string;
  image?: string;
  phone?: string;
  status?: "ACTIVE" | "BLOCKED";
  role?: TUserRole;
}
