import { Prisma } from "@prisma/client";

// Everything needed to render one application, loaded in a single query.
export const applicationInclude = {
  candidate: { select: { id: true, email: true, name: true } },
  job: { select: { id: true, title: true, department: true } },
  history: { orderBy: { at: "asc" } },
  interview: {
    include: {
      panel: { include: { user: { select: { id: true, email: true, name: true } } } },
      evaluations: { include: { panelist: { select: { email: true, name: true } } }, orderBy: { createdAt: "asc" } },
    },
  },
  approval: { include: { approver: { select: { name: true } } } },
  offer: true,
  onboarding: { include: { doneBy: { select: { name: true } } } },
} satisfies Prisma.ApplicationInclude;

export type ApplicationRecord = Prisma.ApplicationGetPayload<{ include: typeof applicationInclude }>;

const iso = (d: Date | null) => (d ? d.toISOString() : null);

/** Shapes a DB record into the JSON contract the frontend consumes. */
export function toApplicationView(a: ApplicationRecord) {
  const stamps = (kind: "DOCUMENT" | "CONFIRMATION") =>
    Object.fromEntries(
      a.onboarding.filter((o) => o.kind === kind).map((o) => [o.key, { by: o.doneBy.name, at: o.doneAt.toISOString() }])
    );

  return {
    id: a.id,
    ref: a.ref,
    state: a.state,
    appliedAt: a.appliedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    candidateName: a.fullName,
    candidateEmail: a.candidate.email,
    candidate: { id: a.candidate.id, phone: a.phone, address: a.address },
    qualifications: a.qualifications,
    experience: a.experience,
    references: a.references,
    cvUrl: a.cvUrl,
    jobId: a.jobId,
    job: a.job,
    history: a.history.map((h) => ({
      state: h.state,
      at: h.at.toISOString(),
      by: h.actorName,
      role: h.actorRole,
      note: h.note,
    })),
    interview: a.interview && {
      id: a.interview.id,
      date: a.interview.scheduledDate.toISOString(),
      location: a.interview.location,
      status: a.interview.status,
      panel: a.interview.panel.map((p) => ({ id: p.user.id, email: p.user.email, name: p.user.name })),
    },
    evaluations: (a.interview?.evaluations ?? []).map((e) => ({
      panelistId: e.panelistId,
      panelistEmail: e.panelist.email,
      panelistName: e.panelist.name,
      technical: e.technicalScore,
      communication: e.communicationScore,
      problemSolving: e.problemSolvingScore,
      teamwork: e.teamworkScore,
      comments: e.comments,
      at: e.createdAt.toISOString(),
    })),
    approval: a.approval && {
      decision: a.approval.decision,
      by: a.approval.approver.name,
      at: a.approval.timestamp.toISOString(),
      note: a.approval.note,
    },
    offer: a.offer && {
      salary: Number(a.offer.salary),
      startDate: a.offer.startDate.toISOString(),
      contract: a.offer.contract,
      status: a.offer.status,
      sentAt: a.offer.sentAt.toISOString(),
      responseDate: iso(a.offer.responseDate),
    },
    onboarding:
      a.state === "ONBOARDING" || a.state === "COMPLETED"
        ? { documents: stamps("DOCUMENT"), confirmations: stamps("CONFIRMATION") }
        : null,
  };
}
