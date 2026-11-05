import { env } from "../../config/env";
import { prisma } from "../client";
import { POSTINGS } from "./jobs.data";

// Publishes the vacancies in jobs.data.ts. Run with `npm run seed:jobs`.
// Safe to re-run: a posting is skipped when one with the same title and
// department already exists.

async function main() {
  void env;
  const adminEmail = (process.env.ADMIN_EMAIL ?? "nysonagumya@gmail.com").toLowerCase();
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) throw new Error(`Admin ${adminEmail} not found. Run \`npm run seed\` first.`);

  let created = 0;
  for (const p of POSTINGS) {
    const exists = await prisma.job.findFirst({ where: { title: p.title, department: p.department } });
    if (exists) {
      console.log(`skip   ${p.title} (${p.department}) already exists`);
      continue;
    }
    await prisma.job.create({
      data: {
        title: p.title,
        department: p.department,
        numPositions: p.numPositions,
        requiredSkills: p.requiredSkills,
        description: p.description,
        closingDate: new Date(Date.now() + p.closesInDays * 86_400_000),
        status: "PUBLISHED",
        createdById: admin.id,
      },
    });
    created++;
    console.log(`create ${p.title} (${p.department})`);
  }
  console.log(`Done. ${created} created, ${POSTINGS.length - created} skipped.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
