import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { EventController } from "./event.controller";
import { EventValidation } from "./event.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ORGANIZER),
  validateRequest(EventValidation.createEvent),
  EventController.createEvent,
);

router.get("/", EventController.getAllEvents);

router.get(
  "/my-events",
  checkAuth(Role.ORGANIZER),
  EventController.getMyEvents,
);

router.get("/:id", EventController.getEventById);

router.get(
  "/:eventId/participants",
  checkAuth(Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  EventController.getEventParticipants,
);

router.patch(
  "/:id",
  checkAuth(Role.ORGANIZER),
  validateRequest(EventValidation.updateEvent),
  EventController.updateEvent,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.MODERATOR, Role.ORGANIZER),
  EventController.deleteEvent,
);

export const EventRoutes = router;
