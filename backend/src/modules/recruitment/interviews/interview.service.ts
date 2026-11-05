import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { httpError } from "../../../common/http";
import { notify } from "../../../common/notify";
import { moveState } from "../workflow/workflow.engine";
import type { ScheduleInput } from "./interview.schema";

async function load(id: string) {
  const app = await prisma.application.findUnique({ where: { id }, include: { job: true, interview: true } });
  if (!app) throw httpError(404, "Application not found");
  return app;
}

export async function schedule(user: User, id: string, input: ScheduleInput) {
  const app = await load(id);

  // FR-06: an interview cannot be assigned to an unregistered panel member.
  const panelists = await prisma.user.findMany({
    where: { id: { in: input.panel }, role: "INTERVIEWER", status: "ACTIVE" },
    select: { id: true },
  });
  if (panelists.length !== new Set(input.panel).size)
    throw httpError(422, "An interview cannot be assigned to an unregistered panel member.");

  await prisma.$transaction(async (tx) => {
    await moveState(tx, id, "INTERVIEW_SCHEDULED", { user }, `Interview booked with ${panelists.length} panelist${panelists.length > 1 ? "s" : ""}`);
    await tx.interview.create({
      data: {
        applicationId: id,
        scheduledDate: input.date,
        location: input.location,
        panel: { create: panelists.map((p) => ({ userId: p.id })) },
      },
    });
    const when = input.date.toLocaleString("en-GB");
    await notify(tx, panelists.map((p) => p.id), `You are on the panel for ${app.fullName} (${app.job.title}) on ${when}`, "INTERVIEW_ASSIGNED", "/interviews");
    await notify(tx, [app.candidateId], `Your interview for ${app.job.title} is on ${when} at ${input.location}`, "INTERVIEW_SCHEDULED", "/");
  });
}

// FR-07: the application moves to UNDER_EVALUATION once the interview is marked completed.
export async function complete(user: User, id: string, _body?: unknown) {
  const app = await load(id);
  if (!app.interview) throw httpError(409, "No interview scheduled.");
  await prisma.$transaction(async (tx) => {
    await moveState(tx, id, "UNDER_EVALUATION", { user }, "Interview completed");
    await tx.interview.update({ where: { id: app.interview!.id }, data: { status: "COMPLETED" } });
    const panel = await tx.interviewPanelist.findMany({ where: { interviewId: app.interview!.id } });
    await notify(tx, panel.map((p) => p.userId), `Please submit your evaluation for ${app.fullName}`, "EVALUATION_DUE", "/interviews");
  });
}
