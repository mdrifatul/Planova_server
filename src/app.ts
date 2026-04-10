import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Api is running",
  });
});

export default app;
