import { prisma } from "../../db";
import { JobStatus } from "@prisma/client";
import type { CreateJobInput } from "./job.schema";

export const listOpen = () =>
  prisma.job.findMany({ where: { status: "PUBLISHED", closingDate: { gt: new Date() } }, orderBy: { closingDate: "asc" } });

export const listAll = () => prisma.job.findMany({ orderBy: { createdAt: "desc" } });

export const findById = (id: string) => prisma.job.findUnique({ where: { id } });

export const create = (createdById: string, data: CreateJobInput) => prisma.job.create({ data: { ...data, createdById } });

export const setStatus = (id: string, status: JobStatus) => prisma.job.update({ where: { id }, data: { status } });
