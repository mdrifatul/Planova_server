import { z } from "zod";

const chatMessage = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message is too long"),
});

export type TChatMessage = z.infer<typeof chatMessage>;

export const AIValidation = {
  chatMessage,
};
