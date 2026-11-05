import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { httpError } from "../../../common/http";
import { notify, idsWithRole } from "../../../common/notify";
import * as applications from "../applications/application.repository";
import { moveState } from "./workflow.engine";
import type { TransitionInput } from "./workflow.schema";

/** Screen / shortlist / reject (FR-05) and select (FR-08). */
export async function transition(user: User, applicationId: string, input: TransitionInput) {
  const app = await applications.findFor(user, applicationId);
  if (!app) throw httpError(404, "Application not found");

  if (app.state === "PENDING_APPROVAL") throw httpError(400, "Use the approval endpoint for the manager's decision");
  if (input.to === "REJECTED" && !input.note) throw httpError(422, "Give a reason so the decision stays explainable.");
  if (input.to === "SELECTED") {
    if (!app.interview?.evaluations.length) throw httpError(409, "Record at least one evaluation before selecting.");
  }

  await prisma.$transaction(async (tx) => {
    await moveState(tx, app.id, input.to, { user }, input.note);

    if (input.to === "SELECTED") {
      // FR-08: a SELECTED application automatically routes to the manager.
      await moveState(tx, app.id, "PENDING_APPROVAL", "SYSTEM", "Routed to Department Manager");
      await notify(tx, await idsWithRole(tx, "MANAGER"), `${app.fullName} is awaiting your approval`, "APPROVAL_REQUESTED", "/candidates");
    }
    if (input.to === "REJECTED")
      await notify(tx, [app.candidateId], `Your application for ${app.job.title} was not successful`, "APPLICATION_REJECTED", "/");
    if (input.to === "SHORTLISTED")
      await notify(tx, [app.candidateId], `You have been shortlisted for ${app.job.title}`, "APPLICATION_SHORTLISTED", "/");
  });
  return applications.findFor(user, applicationId);
}
