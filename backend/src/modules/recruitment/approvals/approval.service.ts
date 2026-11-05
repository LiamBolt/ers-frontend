import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { audit } from "../../../common/audit";
import { httpError } from "../../../common/http";
import { notify, idsWithRole } from "../../../common/notify";
import { moveState, recordEvent } from "../workflow/workflow.engine";
import type { ApprovalInput } from "./approval.schema";

// FR-09 / BR-07: a manager's decision, logged with identity, decision and timestamp.
export async function decide(user: User, id: string, input: ApprovalInput) {
  const app = await prisma.application.findUnique({ where: { id }, include: { approval: true, job: true } });
  if (!app) throw httpError(404, "Application not found");
  if (app.state !== "PENDING_APPROVAL" || app.approval) throw httpError(409, "This application is not awaiting approval.");

  await prisma.$transaction(async (tx) => {
    await tx.approval.create({ data: { applicationId: id, approverId: user.id, decision: input.decision, note: input.note } });
    await audit(tx, user.id, `APPROVAL_${input.decision}`, `application:${id}`);

    if (input.decision === "APPROVED") {
      // Stays PENDING_APPROVAL until HR generates the offer; the approval row makes it offer-eligible.
      await recordEvent(tx, id, app.state, { user }, input.note ? `Approved: ${input.note}` : "Approved");
      await notify(tx, await idsWithRole(tx, "HR_OFFICER"), `${app.fullName} was approved: generate the offer`, "APPROVED", "/candidates");
    } else {
      await moveState(tx, id, "REJECTED", { user }, input.note);
      await notify(tx, [app.candidateId], `Your application for ${app.job.title} was not successful`, "APPLICATION_REJECTED", "/");
    }
  });
}
