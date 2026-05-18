import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { logger } from "./logger";
import { env } from "./env";

function parseDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const port = Number(url.port || "3306");

  return {
    host: url.hostname,
    port,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

const databaseConfig = parseDatabaseUrl(env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password || undefined,
  database: databaseConfig.database,
  connectionLimit: 10,
  connectTimeout: 5_000,
  idleTimeout: 300,
});

export const prisma =
  globalThis.__prismaClient ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prisma;
}

export async function connectPrisma() {
  await prisma.$connect();
  logger.info("prisma connected");
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
  logger.info("prisma disconnected");
}
