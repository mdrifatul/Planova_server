import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  validateRequest(ReviewValidation.createReview),
  ReviewController.createReview,
);

router.patch(
  "/:id",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  validateRequest(ReviewValidation.updateReview),
  ReviewController.updateReview,
);

router.delete(
  "/:id",
  checkAuth(Role.USER, Role.ORGANIZER, Role.ADMIN, Role.MODERATOR),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
