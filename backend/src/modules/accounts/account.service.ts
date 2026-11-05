import bcrypt from "bcryptjs";
import { httpError } from "../../utils/http";
import type { RegisterInput } from "./account.schema";
import * as repo from "./account.repository";

// Self-registration is for candidates only (FR-03). Staff are created by an admin.
export async function register(input: RegisterInput) {
  if (await repo.findByEmail(input.email)) throw httpError(409, "Email is already registered");
  const passwordHash = await bcrypt.hash(input.password, 12); // NFR-03: one-way hash
  return repo.createUser({ email: input.email, name: input.name, phone: input.phone, passwordHash, role: "CANDIDATE" });
}

export async function me(userId: string) {
  const user = await repo.findById(userId);
  if (!user) throw httpError(404, "User not found");
  return user;
}

export const listPanelists = () => repo.listActiveByRole("INTERVIEWER");
