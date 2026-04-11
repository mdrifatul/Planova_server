import { toNodeHandler } from "better-auth/node";
import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Api is running",
  });
});

export default app;
