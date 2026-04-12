import { z } from "zod";

const createCheckout = z.object({
  participationId: z.string().cuid("Invalid participation ID"),
});

export type TCreateCheckout = z.infer<typeof createCheckout>;

export const PaymentValidation = {
  createCheckout,
};
