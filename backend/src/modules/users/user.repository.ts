import { prisma } from "../../database";
import { publicUserSelect } from "../accounts/account.repository";
import type { UpdateUserInput } from "./user.schema";

export const list = (role?: string) =>
  prisma.user.findMany({
    where: role ? { role: role as never } : undefined,
    select: publicUserSelect,
    orderBy: { createdAt: "desc" },
  });

export const update = (id: string, data: UpdateUserInput) => prisma.user.update({ where: { id }, data, select: publicUserSelect });
