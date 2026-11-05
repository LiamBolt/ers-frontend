import bcrypt from "bcryptjs";
import { httpError } from "../../common/http";
import { audit } from "../../common/audit";
import { prisma } from "../../database";
import * as accounts from "../accounts/account.repository";
import * as repo from "./user.repository";
import type { CreateUserInput, UpdateUserInput } from "./user.schema";

export const list = (role?: string) => repo.list(role);

export async function create(adminId: string, input: CreateUserInput) {
  if (await accounts.findByEmail(input.email)) throw httpError(409, "Email is already registered");
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await accounts.createUser({ email: input.email, name: input.name, phone: input.phone, passwordHash, role: input.role });
  await audit(prisma, adminId, `USER_CREATED role=${input.role}`, `user:${user.id}`);
  return user;
}

export async function update(adminId: string, id: string, input: UpdateUserInput) {
  if (id === adminId && (input.status === "DEACTIVATED" || (input.role && input.role !== "ADMIN")))
    throw httpError(400, "You cannot deactivate or demote your own account");
  const existing = await accounts.findById(id);
  if (!existing) throw httpError(404, "User not found");
  const user = await repo.update(id, input);
  await audit(prisma, adminId, `USER_UPDATED ${JSON.stringify(input)}`, `user:${id}`);
  return user;
}
