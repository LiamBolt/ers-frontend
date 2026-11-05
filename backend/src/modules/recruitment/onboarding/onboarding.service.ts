import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { httpError } from "../../../common/http";
import { notify } from "../../../common/notify";
import { moveState, recordEvent } from "../workflow/workflow.engine";
import { ONBOARDING_CONFIRMATIONS, ONBOARDING_DOCUMENTS } from "../workflow/workflow.constants";
import type { ConfirmationInput, DocumentInput } from "./onboarding.schema";

async function requireOnboarding(id: string) {
  const app = await prisma.application.findUnique({ where: { id }, include: { onboarding: true, job: true } });
  if (!app) throw httpError(404, "Application not found");
  if (app.state !== "ONBOARDING") throw httpError(409, "Application is not in onboarding.");
  return app;
}

async function mark(user: User, id: string, kind: "DOCUMENT" | "CONFIRMATION", key: string, note: string) {
  await requireOnboarding(id);
  await prisma.$transaction(async (tx) => {
    await tx.onboardingItem.upsert({
      where: { applicationId_kind_key: { applicationId: id, kind, key } },
      create: { applicationId: id, kind, key, doneById: user.id },
      update: {}, // already recorded: keep the original actor and time (BR-04)
    });
    await recordEvent(tx, id, "ONBOARDING", { user }, note);
  });
}

export async function verifyDocument(user: User, id: string, input: DocumentInput) {
  await mark(user, id, "DOCUMENT", input.name, `Document verified: ${input.name}`);
}

// FR-11: HR, IT, Finance and the Department each record their confirmation.
export async function confirm(user: User, id: string, input: ConfirmationInput) {
  const allowed = input.key === "Department" ? ["MANAGER", "HR_OFFICER", "ADMIN"] : ["HR_OFFICER", "ADMIN"];
  if (!allowed.includes(user.role)) throw httpError(403, `You cannot record the ${input.key} confirmation.`);
  await mark(user, id, "CONFIRMATION", input.key, `${input.key} confirmation recorded`);
}

// BR-08: COMPLETED only once every document is verified and every confirmation recorded.
export async function complete(user: User, id: string) {
  const app = await requireOnboarding(id);
  const done = (kind: string) => new Set(app.onboarding.filter((o) => o.kind === kind).map((o) => o.key));
  const docs = done("DOCUMENT");
  const confs = done("CONFIRMATION");
  const missing = [
    ...ONBOARDING_DOCUMENTS.filter((d) => !docs.has(d)),
    ...ONBOARDING_CONFIRMATIONS.filter((c) => !confs.has(c)).map((c) => `${c} confirmation`),
  ];
  if (missing.length) throw httpError(409, `Cannot complete yet. Outstanding: ${missing.join(", ")}.`);

  await prisma.$transaction(async (tx) => {
    await moveState(tx, id, "COMPLETED", { user }, "All documents verified and confirmations recorded");
    await notify(tx, [app.candidateId], `Welcome aboard! Your onboarding for ${app.job.title} is complete`, "ONBOARDING_COMPLETE", "/");
  });
}
