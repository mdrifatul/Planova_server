import app from "./app";
import { envVars } from "./app/config/env";

const PORT = envVars.PORT;

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
