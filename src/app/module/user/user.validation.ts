import { z } from "zod";

const updateUser = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  role: z.enum(["ADMIN", "ORGANIZER", "USER", "MODERATOR"]).optional(),
});

export type TUpdateUser = z.infer<typeof updateUser>;

export const UserValidation = {
  updateUser,
};
