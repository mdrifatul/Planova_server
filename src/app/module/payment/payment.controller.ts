import { Request, Response } from "express";
import httpStatus from "http-status";

import { env } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

// POST /api/payments/checkout — Create a Stripe Checkout Session for a paid event
const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Unauthorized",
      });
    }

    const { participationId } = req.body;

    if (!participationId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "participationId is required",
      });
    }

    const result = await PaymentService.createCheckoutSession(
      participationId,
      userId,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Checkout session created",
      data: result,
    });
  },
);

// POST /webhook — Handle Stripe webhook events (raw body required)
const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing Stripe signature or webhook secret");
    return res
      .status(400)
      .json({ message: "Missing Stripe signature or webhook secret" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown verification error";
    console.error("Webhook signature verification failed:", message);
    return res
      .status(400)
      .json({ message: "Webhook signature verification failed" });
  }

  try {
    const result = await PaymentService.handleStripeWebhookEvent(event);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    res.status(500).json({
      message: "Error handling webhook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhookEvent,
};
