// Sets (or creates) the admin login. Run once per rotation:
//   ADMIN_EMAIL=admin@misrvisa.com NEW_ADMIN_PASSWORD='...' npx tsx scripts/set-admin-password.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.NEW_ADMIN_PASSWORD ?? "";
  if (!email) throw new Error("ADMIN_EMAIL is required");
  if (password.length < 14) throw new Error("NEW_ADMIN_PASSWORD must be at least 14 characters");

  const prisma = new PrismaClient();
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash, name: "MISR VISA Admin" },
    });
    console.log(`Admin password set for ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
