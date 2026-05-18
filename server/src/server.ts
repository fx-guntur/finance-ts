import { createServer } from "node:http";
import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { ensureDemoUser } from "./bootstrap/ensure-demo-user";

async function bootstrap() {
  if (env.NODE_ENV !== "production") {
    await ensureDemoUser();
    logger.info("demo user ensured");
  }

  const server = createServer(app);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "backend server started");
  });
}

void bootstrap().catch((error) => {
  logger.error({ err: error }, "backend bootstrap failed");
  process.exit(1);
});
