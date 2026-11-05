import { env } from "../config/env";
import bcrypt from "bcryptjs";
import { prisma } from "./connection";

// Bootstrap only: ONE administrator so someone can sign in and create staff
// accounts. No demo candidates, vacancies or applications are ever seeded.
async function main() {
  void env;
  const email = (process.env.ADMIN_EMAIL ?? "nysonagumya@gmail.com").toLowerCase();
  const password = process.env.SEED_PASSWORD;
  if (!password) throw new Error("Set SEED_PASSWORD in .env before seeding");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists; nothing to do.`);
    return;
  }
  await prisma.user.create({
    data: { email, name: process.env.ADMIN_NAME ?? "System Administrator", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`Created admin ${email}. Change the password after first sign-in.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
