import { Router } from "express";

import { Role } from "../../../generated/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { InvitationController } from "./invitation.controller";
import { InvitationValidation } from "./invitation.validation";

const router = Router();

// POST /invitations/send - Send invitation (only organizers)
router.post(
  "/",
  checkAuth(Role.ORGANIZER, Role.ADMIN),
  validateRequest(InvitationValidation.sendInvitation),
  InvitationController.sendInvitation,
);

// GET /invitations/received - Get received invitations
router.get(
  "/received",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  InvitationController.getReceivedInvitations,
);

// GET /invitations/sent - Get sent invitations
router.get(
  "/sent",
  checkAuth(Role.ORGANIZER, Role.ADMIN),
  InvitationController.getSentInvitations,
);

// GET /invitations/event/:eventId - Get all invitations for an event (organizer only)
router.get(
  "/event/:eventId",
  checkAuth(Role.ORGANIZER, Role.ADMIN),
  InvitationController.getEventInvitations,
);

// GET /invitations/:id - Get invitation by ID
router.get(
  "/:id",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  InvitationController.getInvitationById,
);

// PATCH /invitations/:id - Update invitation status (accept/decline)
router.patch(
  "/:id",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  validateRequest(InvitationValidation.updateInvitation),
  InvitationController.updateInvitation,
);

// DELETE /invitations/:id - Delete/cancel invitation
router.delete(
  "/:id",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  InvitationController.deleteInvitation,
);

export const InvitationRoutes = router;
