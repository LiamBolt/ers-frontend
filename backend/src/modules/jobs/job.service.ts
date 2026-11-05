import { Job, User } from "@prisma/client";
import { httpError } from "../../common/http";
import { audit } from "../../common/audit";
import { prisma } from "../../database";
import * as repo from "./job.repository";
import type { CreateJobInput } from "./job.schema";

// Candidates only ever see open vacancies; staff see everything.
export const list = (user: User) => (user.role === "CANDIDATE" ? repo.listOpen() : repo.listAll());

export async function get(user: User, id: string) {
  const job = await repo.findById(id);
  if (!job || (user.role === "CANDIDATE" && job.status !== "PUBLISHED")) throw httpError(404, "Vacancy not found");
  return job;
}

export async function create(user: User, input: CreateJobInput) {
  const job = await repo.create(user.id, input); // published immediately (FR-02)
  await audit(prisma, user.id, "JOB_PUBLISHED", `job:${job.id}`);
  return job;
}

export async function setStatus(user: User, id: string, status: "PUBLISHED" | "CLOSED") {
  if (!(await repo.findById(id))) throw httpError(404, "Vacancy not found");
  const job = await repo.setStatus(id, status);
  await audit(prisma, user.id, `JOB_${status}`, `job:${id}`);
  return job;
}

// Public view of a vacancy: no internal fields (no createdBy).
function toPublicJob({ id, title, department, description, numPositions, requiredSkills, closingDate }: Job) {
  return { id, title, department, description, numPositions, requiredSkills, closingDate };
}

const isOpen = (job: Job) => job.status === "PUBLISHED" && job.closingDate > new Date();

// Landing-page listing: open vacancies only.
export async function listPublic() {
  return (await repo.listOpen()).map(toPublicJob);
}

// One open vacancy for its public page. Closed or unknown ids are a 404.
export async function getPublic(id: string) {
  const job = await repo.findById(id);
  if (!job || !isOpen(job)) throw httpError(404, "This vacancy is no longer open");
  return toPublicJob(job);
}
