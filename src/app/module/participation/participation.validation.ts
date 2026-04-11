import { z } from "zod";

const updateParticipationStatus = z.object({
  status: z.enum(["APPROVED", "REJECTED", "BANNED"]),
});

export type TUpdateParticipationStatus = z.infer<
  typeof updateParticipationStatus
>;

export const ParticipationValidation = {
  updateParticipationStatus,
};
