import { randomBytes } from "crypto";
import { Prisma, User } from "@prisma/client";
import { prisma } from "../../db";
import { applicationInclude, ApplicationRecord } from "./application.serializer";

// Which applications a role may see (BR-01 / BR-03). Used by every read path.
export function visibilityFilter(user: User): Prisma.ApplicationWhereInput {
  switch (user.role) {
    case "CANDIDATE":
      return { candidateId: user.id };
    case "INTERVIEWER":
      return { interview: { panel: { some: { userId: user.id } } } };
    default:
      return {};
  }
}

export const listFor = (user: User): Promise<ApplicationRecord[]> =>
  prisma.application.findMany({
    where: visibilityFilter(user),
    include: applicationInclude,
    relationLoadStrategy: "join",
    orderBy: { updatedAt: "desc" },
  });

export const findFor = (user: User, id: string): Promise<ApplicationRecord | null> =>
  prisma.application.findFirst({ where: { id, ...visibilityFilter(user) }, include: applicationInclude, relationLoadStrategy: "join" });

/** Loads without a visibility filter. Call only after the caller has authorised access. */
export const findById = (id: string): Promise<ApplicationRecord | null> =>
  prisma.application.findUnique({ where: { id }, include: applicationInclude, relationLoadStrategy: "join" });

export const findExisting = (candidateId: string, jobId: string) =>
  prisma.application.findUnique({ where: { candidateId_jobId: { candidateId, jobId } } });

export const newRef = () => `APP-${randomBytes(3).toString("hex").toUpperCase()}`;
