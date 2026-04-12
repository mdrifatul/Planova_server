import { Router } from "express";
import { UserController } from "./user.controller";

import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/:id",
  validateRequest(UserValidation.updateUser),
  UserController.updateUser,
);

export const UserRoutes = router;
