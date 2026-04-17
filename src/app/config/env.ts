import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  APP_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  APP_PASS: string;
  APP_USER: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  CHATKIT_WORKFLOW_ID: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requireEnvVariable = [
    "DATABASE_URL",
    "APP_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "APP_PASS",
    "APP_USER",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "GEMINI_API_KEY",
    "OPENAI_API_KEY",
    "CHATKIT_WORKFLOW_ID",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  const missing = requireEnvVariable.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    // Vercel automatically sets process.env.VERCEL = "1"
    // On Vercel: log a warning but don't crash the whole function at module load.
    // If env vars are missing on Vercel, they must be added in the Dashboard.
    // On local dev: throw immediately so the developer is alerted.
    console.error(
      `[ENV] Missing required environment variables: ${missing.join(", ")}`,
    );
    if (!process.env.VERCEL) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable(s) not set: ${missing.join(", ")}`,
      );
    }
  }

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    APP_URL: process.env.APP_URL as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    APP_PASS: process.env.APP_PASS as string,
    APP_USER: process.env.APP_USER as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    CHATKIT_WORKFLOW_ID: process.env.CHATKIT_WORKFLOW_ID as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  };
};

export const env = loadEnvVariables();
