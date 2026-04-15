import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { PaymentController } from "./app/module/payment/payment.controller";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1", IndexRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Api is running",
  });
});

app.use(globalErrorHandler);

export default app;
