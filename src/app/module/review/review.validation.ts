import { z } from "zod";

const createReview = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
  eventId: z.string().cuid("Invalid event ID"),
});

const updateReview = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type TCreateReview = z.infer<typeof createReview>;
export type TUpdateReview = z.infer<typeof updateReview>;

export const ReviewValidation = {
  createReview,
  updateReview,
};
