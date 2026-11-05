import { env } from "../config/env";
import { prisma } from "./connection";

// The agency's published vacancies. Run with `npm run seed:jobs`.
// Safe to re-run: a posting is skipped when one with the same title and
// department already exists. Closing dates are set relative to the run date.
//
// These are real postings for the live site. Edit this list (or use the
// Create Vacancy screen) rather than adding mock data elsewhere.

type Posting = {
  title: string;
  department: string;
  numPositions: number;
  requiredSkills: string;
  description: string;
  closesInDays: number;
};

const POSTINGS: Posting[] = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    numPositions: 2,
    requiredSkills: "React, TypeScript, Tailwind CSS, REST APIs, Accessibility, Git",
    description:
      "Build and maintain the web applications our clients rely on every day. You will turn designs into fast, accessible interfaces, review code, and mentor junior developers.",
    closesInDays: 45,
  },
  {
    title: "Backend Engineer (Node.js)",
    department: "Engineering",
    numPositions: 2,
    requiredSkills: "Node.js, TypeScript, PostgreSQL, REST API design, Docker, Testing",
    description:
      "Design and ship reliable APIs and background services. You will own features end to end, from database schema to deployment, and keep the platform secure and observable.",
    closesInDays: 45,
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    numPositions: 1,
    requiredSkills: "Figma, User research, Design systems, Prototyping, Accessibility",
    description:
      "Shape clear, humane product experiences. You will run research, design flows and components, and work closely with engineers so what ships matches what was designed.",
    closesInDays: 50,
  },
  {
    title: "Accountant",
    department: "Finance",
    numPositions: 1,
    requiredSkills: "Bookkeeping, Bank reconciliation, IFRS, Excel, Tax compliance",
    description:
      "Keep our books accurate and audit-ready. You will manage payables and receivables, prepare monthly reconciliations and reports, and support statutory filings.",
    closesInDays: 40,
  },
  {
    title: "Marketing Executive",
    department: "Marketing",
    numPositions: 1,
    requiredSkills: "Content writing, Social media, Email campaigns, Analytics, Event coordination",
    description:
      "Grow awareness of our services through clear content and well-run campaigns. You will plan and publish across channels, track results, and coordinate events with partners.",
    closesInDays: 40,
  },
  {
    title: "Customer Support Lead",
    department: "Customer Support",
    numPositions: 1,
    requiredSkills: "Team leadership, Escalation handling, Ticketing tools, Clear writing, Empathy",
    description:
      "Lead a small support team and set the standard for how we help customers. You will coach the team, handle escalations, and turn recurring issues into product and process fixes.",
    closesInDays: 35,
  },
];

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
