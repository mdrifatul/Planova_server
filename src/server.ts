import app from "./app";
import { env } from "./app/config/env";

const PORT = env.PORT;

const bootstrap = () => {
  try {
    // await prisma.$connect();
    // console.log("connect to database");

    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  } catch (error) {
    console.log("An error occured:", error);
    // await prisma.$disconnect();
    process.exit(1);
  }
};

bootstrap();
