import { User } from "@prisma/client";
import { httpError } from "../../utils/http";
import { audit } from "../../utils/audit";
import { prisma } from "../../db";
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
