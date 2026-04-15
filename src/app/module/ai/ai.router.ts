import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AIController } from "./ai.controller";
import { AIValidation } from "./ai.validation";

const router = express.Router();

router.get("/search-suggestions", AIController.getSearchSuggestions);

router.get("/recommendations", checkAuth(), AIController.getRecommendations);

router.get("/trending", AIController.getTrending);

router.post(
  "/chat",
  validateRequest(AIValidation.chatMessage),
  AIController.chatAssistant,
);

export const aiRouter: express.Router = router;
