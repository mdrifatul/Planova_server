import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { EventRoutes } from "../module/event/event.route";
import { CategoryRoutes } from "../module/category/category.route";
import { ParticipationRoutes } from "../module/participation/participation.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/events", EventRoutes);
router.use("/categories", CategoryRoutes);
router.use("/participations", ParticipationRoutes);

export const IndexRoutes = router;
