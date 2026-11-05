// Removes everything created by scripts/smoke.sh and manual UI testing
// (users whose email starts with "smoke-" or "uitest-", and all their data).
// Never touches real accounts. Usage: npx tsx scripts/cleanup-test-data.ts
import "../src/config/env";
import { prisma } from "../src/db";

const prefixes = ["smoke-", "uitest-"];

async function main() {
  const users = await prisma.user.findMany({
    where: { OR: prefixes.map((p) => ({ email: { startsWith: p } })), email: { endsWith: "@ers.test" } },
    select: { id: true, email: true },
  });
  const ids = users.map((u) => u.id);
  if (!ids.length) return console.log("No test data found.");

  const apps = await prisma.application.deleteMany({
    where: { OR: [{ candidateId: { in: ids } }, { job: { createdById: { in: ids } } }] },
  }); // cascades interviews, evaluations, approvals, offers, onboarding, history
  const jobs = await prisma.job.deleteMany({ where: { createdById: { in: ids } } });
  const audit = await prisma.auditLog.deleteMany({ where: { userId: { in: ids } } });
  const hist = await prisma.applicationHistory.deleteMany({ where: { actorId: { in: ids } } });
  const removed = await prisma.user.deleteMany({ where: { id: { in: ids } } }); // cascades notifications
  console.log({ users: removed.count, applications: apps.count, jobs: jobs.count, auditLogs: audit.count, historyRows: hist.count });
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
