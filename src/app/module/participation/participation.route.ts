import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ParticipationController } from "./participation.controller";
import { ParticipationValidation } from "./participation.validation";

const router = Router();

router.post(
  "/join/:eventId",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  ParticipationController.joinEvent,
);

router.patch(
  "/status/:participationId",
  checkAuth(Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  validateRequest(ParticipationValidation.updateParticipationStatus),
  ParticipationController.updateParticipationStatus,
);

router.get(
  "/my-participations",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  ParticipationController.getMyParticipations,
);

router.delete(
  "/:participationId",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  ParticipationController.deleteParticipation,
);

export const ParticipationRoutes = router;
