import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

// Create Stripe Checkout Session for a paid event participation
router.post(
  "/checkout",
  checkAuth(),
  validateRequest(PaymentValidation.createCheckout),
  PaymentController.createCheckoutSession
);

export const PaymentRoutes = router;
