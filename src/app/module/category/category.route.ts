import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(CategoryValidation.createCategory),
  CategoryController.createCategory,
);

router.get("/", CategoryController.getAllCategories);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
