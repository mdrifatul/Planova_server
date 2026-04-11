import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { EventRoutes } from "../module/event/event.route";
import { CategoryRoutes } from "../module/category/category.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/events", EventRoutes);
router.use("/categories", CategoryRoutes);

export const IndexRoutes = router;
