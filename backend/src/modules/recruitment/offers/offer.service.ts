import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { httpError } from "../../../common/http";
import { notify, idsWithRole } from "../../../common/notify";
import { moveState } from "../workflow/workflow.engine";
import type { OfferInput, OfferResponseInput } from "./offer.schema";

// FR-10: HR generates an offer for an APPROVED candidate.
export async function send(user: User, id: string, input: OfferInput) {
  const app = await prisma.application.findUnique({ where: { id }, include: { approval: true, job: true } });
  if (!app) throw httpError(404, "Application not found");
  if (app.approval?.decision !== "APPROVED") throw httpError(409, "The manager must approve before an offer can be made.");

  await prisma.$transaction(async (tx) => {
    await moveState(tx, id, "OFFER_SENT", { user }, "Offer issued");
    await tx.offer.create({ data: { applicationId: id, salary: input.salary, startDate: input.startDate, contract: input.contract } });
    await notify(tx, [app.candidateId], `You have a job offer for ${app.job.title}`, "OFFER_SENT", "/");
  });
}

// BR-06: the offer stays OFFER_SENT until a response is recorded; it never silently expires.
export async function respond(user: User, id: string, input: OfferResponseInput) {
  const app = await prisma.application.findUnique({ where: { id }, include: { offer: true, job: true } });
  if (!app?.offer) throw httpError(404, "No offer on this application.");
  if (user.role === "CANDIDATE" && app.candidateId !== user.id) throw httpError(404, "Application not found");
  if (app.offer.status !== "OFFER_SENT") throw httpError(409, "This offer has already been answered.");

  await prisma.$transaction(async (tx) => {
    await tx.offer.update({ where: { id: app.offer!.id }, data: { status: input.response, responseDate: new Date() } });
    const hr = await idsWithRole(tx, "HR_OFFICER");
    if (input.response === "ACCEPTED") {
      await moveState(tx, id, "OFFER_ACCEPTED", { user }, input.note || "Offer accepted");
      await moveState(tx, id, "ONBOARDING", "SYSTEM", "Onboarding opened"); // FR-10: ACCEPTED moves into ONBOARDING
      await notify(tx, hr, `${app.fullName} accepted the offer: start onboarding`, "OFFER_ACCEPTED", "/candidates");
    } else {
      await moveState(tx, id, "DECLINED", { user }, input.note || "Offer declined");
      await notify(tx, hr, `${app.fullName} declined the offer`, "OFFER_DECLINED", "/candidates");
    }
  });
}
