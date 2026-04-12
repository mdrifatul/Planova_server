import { z } from "zod";

const createCategory = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
});

export type TCreateCategory = z.infer<typeof createCategory>;

export const CategoryValidation = {
  createCategory,
};
