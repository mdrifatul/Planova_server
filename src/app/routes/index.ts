import { Router } from "express";
import { CategoryRoutes } from "../module/category/category.route";
import { EventRoutes } from "../module/event/event.route";
import { InvitationRoutes } from "../module/invitation/invitation.route";
import { ParticipationRoutes } from "../module/participation/participation.route";
import { UserRoutes } from "../module/user/user.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/events", EventRoutes);
router.use("/categories", CategoryRoutes);
router.use("/participations", ParticipationRoutes);
router.use("/invitations", InvitationRoutes);

export const IndexRoutes = router;
