import { z } from "zod";

const createCheckout = z.object({
  eventId: z.string().cuid("Invalid event ID"),
});

export type TCreateCheckout = z.infer<typeof createCheckout>;

export const PaymentValidation = {
  createCheckout,
};
