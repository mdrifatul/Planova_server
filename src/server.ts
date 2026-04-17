import app from "./app";
import { env } from "./app/config/env";
import { prisma } from "./app/lib/prisma";

const PORT = env.PORT;

const bootstrap = async () => {
  try {
    await prisma.$connect();

    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  } catch (error) {
    console.log("An error occured:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

bootstrap();
