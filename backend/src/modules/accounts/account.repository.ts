import { prisma } from "../../database";
import { UserRole } from "@prisma/client";

export const publicUserSelect = { id: true, email: true, name: true, phone: true, role: true, status: true, createdAt: true } as const;

export const findByEmail = (email: string) => prisma.user.findUnique({ where: { email } });

export const createUser = (data: { email: string; name: string; phone?: string; passwordHash: string; role: UserRole }) =>
  prisma.user.create({ data, select: publicUserSelect });

export const findById = (id: string) => prisma.user.findUnique({ where: { id }, select: publicUserSelect });

export const listActiveByRole = (role: UserRole) =>
  prisma.user.findMany({ where: { role, status: "ACTIVE" }, select: { id: true, name: true, email: true }, orderBy: { name: "asc" } });
