import { Prisma } from "@prisma/client";
import { prisma } from "../../db";
import { CLOSED_STATES } from "../workflow/workflow.constants";
import type { ReportQuery } from "./report.schema";

const MAIN_PATH = [
  "SUBMITTED", "UNDER_SCREENING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "UNDER_EVALUATION",
  "SELECTED", "PENDING_APPROVAL", "OFFER_SENT", "OFFER_ACCEPTED", "ONBOARDING", "COMPLETED",
] as const;

const DAY = 86_400_000;

export async function summary(q: ReportQuery) {
  const where: Prisma.ApplicationWhereInput = {
    appliedAt: {
      ...(q.from ? { gte: new Date(`${q.from}T00:00:00.000Z`) } : {}),
      ...(q.to ? { lte: new Date(`${q.to}T23:59:59.999Z`) } : {}),
    },
    ...(q.jobId ? { jobId: q.jobId } : {}),
    ...(q.department ? { job: { department: q.department } } : {}),
  };

  const apps = await prisma.application.findMany({
    where,
    include: {
      job: { select: { id: true, title: true, department: true } },
      history: { select: { state: true, at: true }, orderBy: { at: "asc" } },
      offer: { select: { status: true } },
    },
    orderBy: { appliedAt: "desc" },
  });

  const reached = (s: string) => apps.filter((a) => a.history.some((h) => h.state === s)).length;
  const current = (s: string) => apps.filter((a) => a.state === s).length;
  const closed = new Set<string>(CLOSED_STATES);
  const hired = apps.filter((a) => a.state === "COMPLETED");
  const accepted = apps.filter((a) => a.offer?.status === "ACCEPTED").length;
  const declined = apps.filter((a) => a.offer?.status === "DECLINED").length;

  const avgDaysToHire = hired.length
    ? Math.round(hired.reduce((sum, a) => sum + (a.history[a.history.length - 1].at.getTime() - a.appliedAt.getTime()) / DAY, 0) / hired.length)
    : null;

  const byVacancyMap = new Map<string, { job: { id: string; title: string; department: string }; total: number; active: number; hired: number; rejected: number }>();
  for (const a of apps) {
    const row = byVacancyMap.get(a.jobId) ?? { job: a.job, total: 0, active: 0, hired: 0, rejected: 0 };
    row.total++;
    if (!closed.has(a.state)) row.active++;
    if (a.state === "COMPLETED") row.hired++;
    if (a.state === "REJECTED") row.rejected++;
    byVacancyMap.set(a.jobId, row);
  }

  return {
    totals: {
      applications: apps.length,
      inProgress: apps.filter((a) => !closed.has(a.state)).length,
      hired: hired.length,
      rejected: current("REJECTED"),
      offersAccepted: accepted,
      offersDeclined: declined,
      offerAcceptanceRate: accepted + declined ? Math.round((accepted / (accepted + declined)) * 100) : null,
      avgDaysToHire,
    },
    funnel: MAIN_PATH.map((state) => ({ state, count: reached(state) })),
    byState: [...MAIN_PATH, "REJECTED", "DECLINED"].map((state) => ({ state, count: current(state) })),
    byVacancy: [...byVacancyMap.values()],
    rows: apps.map((a) => ({
      id: a.id, ref: a.ref, candidateName: a.fullName, job: a.job, state: a.state,
      appliedAt: a.appliedAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
    })),
  };
}
