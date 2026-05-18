import { prisma } from "../config/prisma";

const DEMO_USER_ID = "demo-user";

export async function ensureDemoUser() {
  await prisma.user.upsert({
    where: {
      id: DEMO_USER_ID,
    },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: "demo@finance.local",
      name: "Demo User",
      passwordHash: "demo-password-hash",
      status: "active",
    },
  });
}
