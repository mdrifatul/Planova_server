import { z } from "zod";

const sendInvitation = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
});

const updateInvitation = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),
});

export type TSendInvitation = z.infer<typeof sendInvitation>;
export type TUpdateInvitation = z.infer<typeof updateInvitation>;

export const InvitationValidation = {
  sendInvitation,
  updateInvitation,
};
