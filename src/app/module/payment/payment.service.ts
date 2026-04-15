import httpStatus from "http-status";
import Stripe from "stripe";
import { Currency, PaymentStatus } from "../../../../generated/prisma/enums";
import { env } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

// Create a Stripe Checkout Session for a paid event participation
const createCheckoutSession = async (
  eventId: string,
  userId: string,
) => {
  // Find the participation with participant and event details
  const participation = await prisma.participation.findUnique({
    where: { userId_eventId: { userId, eventId } },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          fee: true,
          currency: true,
        },
      },
      payment: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!participation) {
    throw new AppError(httpStatus.NOT_FOUND, "Participation not found");
  }

  // Authorization: only the participation owner can create a checkout
  if (participation.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to pay for this participation",
    );
  }

  // Don't allow double payment
  if (participation.payment) {
    if (participation.payment.status === PaymentStatus.PAID) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This participation has already been paid",
      );
    }
  }

  const event = participation.event;
  if (!event.fee || event.fee <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This event does not have a fee",
    );
  }

  // Build Stripe line item for the event fee
  const lineItems: NonNullable<
    Parameters<typeof stripe.checkout.sessions.create>[0]
  >["line_items"] = [
    {
      price_data: {
        currency: (event.currency?.toLowerCase() || "usd") as string,
        product_data: {
          name: `Event Registration: ${event.title}`,
          description: event.description || undefined,
        },
        unit_amount: Math.round(event.fee * 100), // Convert to cents
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: participation.user.email,
    metadata: {
      participationId: participation.id,
      userId: participation.userId,
      eventId: event.id,
    },
    success_url: `${env.APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/payment/cancel`,
  });

  // Create or update Payment record in UNPAID state
  let payment = participation.payment;
  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        userId: participation.userId,
        eventId: event.id,
        amount: event.fee,
        currency: event.currency || Currency.USD,
        status: PaymentStatus.UNPAID,
        transactionId: session.id,
      },
    });

    // Link payment to participation
    await prisma.participation.update({
      where: { id: participation.id },
      data: { paymentId: payment.id },
    });
  } else {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.UNPAID,
        transactionId: session.id,
        amount: event.fee,
        currency: event.currency || Currency.USD,
      },
    });
  }

  return { sessionId: session.id, url: session.url };
};

// Handle incoming Stripe webhook events (idempotent)
const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  // Only handle checkout.session.completed
  if (event.type !== "checkout.session.completed") {
    return { received: true, message: `Unhandled event type: ${event.type}` };
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const participationId = session.metadata?.participationId;

  if (!participationId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Missing required metadata in session",
    );
  }

  // Idempotency check — skip if this session was already processed
  const existingPayment = await prisma.payment.findFirst({
    where: {
      transactionId: session.id,
      status: PaymentStatus.PAID,
    },
  });

  if (existingPayment) {
    return { received: true, message: "Payment already processed" };
  }

  // Find the payment record by transactionId (precise match)
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: session.id,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
  }

  // Update Payment record + Participation status in a transaction
  await prisma.$transaction(async (tx) => {
    // Update the payment record
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        paymentMethod: "card",
      },
    });

    // Update participation payment status
    await tx.participation.update({
      where: { id: participationId },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return { received: true, message: "Payment confirmed" };
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhookEvent,
};
