import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { uploadBuffer } from "../../../config/cloudinary";
import { httpError } from "../../../common/http";
import { notify, idsWithRole } from "../../../common/notify";
import { recordEvent } from "../workflow/workflow.engine";
import * as jobs from "../../jobs/job.repository";
import * as repo from "./application.repository";
import { toApplicationView } from "./application.serializer";
import type { SubmitApplicationInput } from "./application.schema";

export async function list(user: User) {
  return (await repo.listFor(user)).map(toApplicationView);
}

export async function get(user: User, id: string) {
  const app = await repo.findFor(user, id);
  if (!app) throw httpError(404, "Application not found");
  return toApplicationView(app);
}

/** Reloads an application after a mutation, as the caller sees it. */
export async function view(user: User, id: string) {
  return get(user, id);
}

export async function submit(user: User, input: SubmitApplicationInput, cv?: Express.Multer.File) {
  if (!cv) throw httpError(422, "An application cannot be submitted without a CV attachment.");

  const job = await jobs.findById(input.jobId);
  if (!job || job.status !== "PUBLISHED" || job.closingDate <= new Date())
    throw httpError(404, "This vacancy is not open for applications");
  if (await repo.findExisting(user.id, job.id)) throw httpError(409, "You have already applied for this vacancy");

  const cvUrl = await uploadBuffer(cv.buffer, "ers/cvs");

  const created = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        ref: repo.newRef(),
        candidateId: user.id,
        jobId: job.id,
        fullName: input.fullName,
        phone: input.phone,
        address: input.address,
        qualifications: input.qualifications,
        experience: input.experience,
        references: input.references,
        cvUrl,
      },
    });
    await recordEvent(tx, app.id, "SUBMITTED", { user }, "Application submitted"); // persisted as SUBMITTED (BR-02)
    await notify(tx, await idsWithRole(tx, "HR_OFFICER"), `New application from ${input.fullName} for ${job.title}`, "APPLICATION_SUBMITTED", "/candidates");
    return app;
  });
  return get(user, created.id);
}
